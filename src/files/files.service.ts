import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { readFile, remove, renameSync } from 'fs-extra';
import { basename } from 'path';
import { IsolationLevel } from 'src/common/enums/isolation-level.enum';
import { UserRole } from 'src/common/enums/user-role.enum';
import { UserIdentity } from 'src/common/interfaces/user-identity.interface';
import { GenericCrudService } from 'src/common/services/generic-crud.service';
import { isAdmin, isCampus, isProfessorship, isStudentOrScholarship } from 'src/common/utils/is-role-functions';
import { Course } from 'src/faculty-entities/courses/entities/course.entity';
import { EOrderState } from 'src/orders/enums/e-order-state.enum';
import { Professorship } from 'src/users/professorships/entities/professorship.entity';
import { ExceededAvailableStorageException } from 'src/users/professorships/exceptions/exceeded-available-storage.exception';
import { ProfessorshipsService } from 'src/users/professorships/professorships.service';
import { User } from 'src/users/users/entities/user.entity';
import { DeepPartial, EntityManager, getConnection, SelectQueryBuilder } from 'typeorm';
import { CreateFileDto } from './dtos/create-file.dto';
import { PartialUpdateFileDto } from './dtos/partial-update-file.dto';
import { File } from './entities/file.entity';
import { FileType } from './enums/file-type.enum';
import { FilesRepository } from './files.repository';
import { buildFilename } from './utils/build-filename';
import { isFileFromUser } from './utils/is-file-from-user';
import { isSystemProfessorshipFile, isSystemStaffFile, isTemporaryFile } from './utils/is-file-type';

@Injectable()
export class FilesService extends GenericCrudService<File> {
  constructor(
    @Inject(forwardRef(() => ProfessorshipsService)) private readonly professorshipsService: ProfessorshipsService,
  ) {
    super(File);
  }

  //* findAll
  protected addExtraClauses(queryBuilder: SelectQueryBuilder<File>, user?: UserIdentity) {
    queryBuilder.innerJoinAndSelect(`${queryBuilder.alias}.course`, 'course');

    //* /files/me
    if (user) {
      queryBuilder.andWhere('owner_id = :userId', { userId: user.id });
    }

    return queryBuilder;
  }

  async findContentById(id: string, manager: EntityManager, user: UserIdentity) {
    const file = await this.findOne(id, manager, user);
    return readFile(file.path);
  }

  //* findOne // findContentById
  protected async checkFindByIdConditions(file: File, _manager: EntityManager, user: UserIdentity) {
    this.userCanReadFile(file, user);
  }

  private userCanReadFile(file: File, user: UserIdentity) {
    //* All users can access system files. Temporary files are only accessible by its owners, campus users and admins
    if (isTemporaryFile(file)) {
      if (isProfessorship(user) || (isStudentOrScholarship(user) && !isFileFromUser(user.id, file))) {
        throw new ForbiddenException('Prohibido el acceso al recurso.');
      }
    }
  }

  async create(createFileDto: CreateFileDto, manager: EntityManager, user: UserIdentity) {
    const filesRepository = this.getFilesRepository(manager);

    try {
      await this.checkIfUserCanUploadFiles(user, createFileDto.size, manager);
      return filesRepository.saveAndReload(this.hydrateDto(createFileDto, user.role));
    } catch (error) {
      if (error instanceof ExceededAvailableStorageException) {
        await this.removeFromFS([createFileDto.path]);
      }
      throw error;
    }
  }

  async createBulk(createFileDtos: CreateFileDto[], manager: EntityManager, user: UserIdentity) {
    const filesRepository = this.getFilesRepository(manager);

    const totalSize = createFileDtos.reduce((total, file) => total + file.size, 0);

    try {
      await this.checkIfUserCanUploadFiles(user, totalSize, manager);
      return filesRepository.saveAndReload(
        createFileDtos.map((createFileDto) => this.hydrateDto(createFileDto, user.role)),
      );
    } catch (error) {
      if (error instanceof ExceededAvailableStorageException) {
        await this.removeFromFS(createFileDtos.map((createFileDtos) => createFileDtos.path));
      }
      throw error;
    }
  }

  private async checkIfUserCanUploadFiles(user: UserIdentity, totalSize: number, manager: EntityManager) {
    return (
      !isProfessorship(user) || !!(await this.professorshipsService.useUpStorageAvailable(user.id, totalSize, manager))
    );
  }

  private hydrateDto(createFileDto: CreateFileDto, role: UserRole): DeepPartial<File> {
    return {
      ...createFileDto,
      owner: new User({ id: createFileDto.ownerId }),
      course: new Course({ id: createFileDto.courseId }),
      type: this.getFileTypeBasedOnRole(role),
    };
  }

  private getFileTypeBasedOnRole(role: UserRole) {
    switch (role) {
      case UserRole.ADMIN:
      case UserRole.CAMPUS:
        return FileType.SYSTEM_STAFF;
      case UserRole.PROFESSORSHIP:
        return FileType.SYSTEM_PROFESSORSHIP;
      default:
        return FileType.TEMPORARY;
    }
  }

  async update(id: string, updateFileDto: PartialUpdateFileDto, manager: EntityManager, user: UserIdentity) {
    const filesRepository = this.getFilesRepository(manager);

    const file = await filesRepository.findOne(id);
    if (file) {
      await this.checkUpdateConditions(updateFileDto, file, manager, user);

      let newPath: string;
      if (updateFileDto.name) {
        newPath = this.updatePathInFS(updateFileDto.name, file);
      }

      return filesRepository.updateAndReload(id, { ...updateFileDto, ...(!!updateFileDto.name && { path: newPath }) });
    } else {
      this.throwCustomNotFoundException(id);
    }
  }

  //* update
  protected async checkUpdateConditions(
    _updateFileDto: PartialUpdateFileDto,
    file: File,
    _manager: EntityManager,
    user: UserIdentity,
  ) {
    this.userCanUpdateFile(file, user);
  }

  private userCanUpdateFile(file: File, user: UserIdentity) {
    if (isTemporaryFile(file)) {
      throw new BadRequestException('Los archivos temporales no pueden ser modificados una vez que han sido creados.');
    } else if (isSystemStaffFile(file) && !(isAdmin(user) || isCampus(user))) {
      throw new ForbiddenException('Prohibido el acceso al recurso.');
    } else if (!(isAdmin(user) || isCampus(user) || (isProfessorship(user) && isFileFromUser(user.id, file)))) {
      throw new ForbiddenException('Prohibido el acceso al recurso.');
    }
  }

  private updatePathInFS(newFilename: string, file: File) {
    const newPath = file.path.replace(basename(file.path), buildFilename(newFilename, file.mimetype));
    renameSync(file.path, newPath);
    return newPath;
  }

  //* delete
  protected async checkDeleteConditions(file: File, _manager: EntityManager, user: UserIdentity) {
    //! Same conditions for the moment
    this.userCanUpdateFile(file, user);
  }

  //* delete
  protected async beforeDelete(file: File, manager: EntityManager) {
    if (isSystemProfessorshipFile(file)) {
      await this.professorshipsService.topUpStorageAvailable(file.ownerId, file.size, manager);
    }
  }

  async softRemoveByCourseId(courseId: string, manager: EntityManager) {
    const filesRepository = this.getFilesRepository(manager);
    const files = await filesRepository.find({ where: { course: { id: courseId } } });
    return filesRepository.softRemove(files);
  }

  //* Method useful to delete temporary files
  async softRemoveAndEraseFromFS(files: File[], manager: EntityManager) {
    const filesRepository = this.getFilesRepository(manager);

    await this.removeFromFSandUpdateDB(files, manager);
    return filesRepository.softRemove(files);
  }

  private async removeFromFSandUpdateDB(files: File[], manager: EntityManager) {
    const filesRepository = this.getFilesRepository(manager);

    await this.removeFromFS(files.map((file) => file.path));

    files.forEach((file) => (file.physicallyErased = true));
    return filesRepository.saveAndReload(files);
  }

  private removeFromFS(paths: string[]) {
    return Promise.all(paths.map((path) => remove(path)));
  }

  // TODO: Verify this feature, it may not be necessary anymore
  async linkFilesToProfessorship(professorship: Professorship, manager: EntityManager) {
    const filesRepository = this.getFilesRepository(manager);

    const files = await filesRepository.find({
      where: { type: FileType.SYSTEM_PROFESSORSHIP, course: { id: professorship.courseId } },
      withDeleted: true,
    });
    files.forEach((file) => (file.owner = professorship));
    await filesRepository.save(files);

    return filesRepository.recover(files);
  }

  // TODO: Verify this feature, it may not be necessary the unlink part anymore
  async unlinkFilesFromProfessorship(professorship: Professorship, manager: EntityManager) {
    const filesRepository = this.getFilesRepository(manager);

    const files = await filesRepository.find({ where: { owner: { id: professorship.id } } });
    files.forEach((file) => (file.owner = null));
    await filesRepository.save(files);

    await filesRepository.softRemove(files);
  }

  // TODO: Enable cron job during deployment
  @Cron(CronExpression.EVERY_DAY_AT_3AM, { name: 'fileEraser' })
  private async removeUnusedDeletedFiles() {
    const connection = getConnection();

    return connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager: EntityManager) => {
      const files = await manager
        .createQueryBuilder()
        .select('file')
        .from(File, 'file')
        .innerJoin('file.orderFiles', 'orderFiles')
        .innerJoin('orderFiles.order', 'order')
        .innerJoin('order.state', 'state')
        .withDeleted()
        .where('file.deleteDate IS NOT NULL')
        .andWhere('file.physically_erased = :erased', { erased: false })
        // TODO: See if it's possible somehow to use first implementation instead of second one
        .andWhere('state.code NOT IN (:...activeStates)', {
          activeStates: [EOrderState.REQUESTED, EOrderState.IN_PROCESS],
        })
        // .andWhere(`state.code NOT IN ('${EOrderState.REQUESTED}','${EOrderState.IN_PROCESS}')`)
        .getMany();

      return this.removeFromFSandUpdateDB(files, manager);
    });
  }

  private getFilesRepository(manager: EntityManager) {
    return manager.getCustomRepository(FilesRepository);
  }

  protected throwCustomNotFoundException(id: string) {
    throw new NotFoundException(`Archivo ${id} no encontrado.`);
  }
}
