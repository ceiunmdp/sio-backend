import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { existsSync, mkdirSync, moveSync, readFile, remove } from 'fs-extra';
import { flatten } from 'lodash';
import { basename, dirname, join } from 'path';
import { IsolationLevel } from 'src/common/enums/isolation-level.enum';
import { UserRole } from 'src/common/enums/user-role.enum';
import { UserIdentity } from 'src/common/interfaces/user-identity.interface';
import { GenericCrudService } from 'src/common/services/generic-crud.service';
import { isAdmin, isCampus, isProfessorship, isStudentOrScholarship } from 'src/common/utils/is-role-functions';
import { MulterConfigService } from 'src/config/multer/multer-config.service';
import { Course } from 'src/faculty-entities/courses/entities/course.entity';
import { EOrderState } from 'src/orders/orders/enums/e-order-state.enum';
import { Professorship } from 'src/users/professorships/entities/professorship.entity';
import { ExceededAvailableStorageException } from 'src/users/professorships/exceptions/exceeded-available-storage.exception';
import { ProfessorshipsService } from 'src/users/professorships/professorships.service';
import { User } from 'src/users/users/entities/user.entity';
import { Brackets, DeepPartial, EntityManager, getConnection, SelectQueryBuilder } from 'typeorm';
import { CreateFileDto } from './dtos/create-file.dto';
import { PartialUpdateFileDto } from './dtos/partial-update-file.dto';
import { File } from './entities/file.entity';
import { FileType } from './enums/file-type.enum';
import { FilesRepository } from './files.repository';
import { buildFilename } from './utils/build-filename';
import { isFileFromUser } from './utils/is-file-from-user';
import { isSystemProfessorshipFile, isSystemStaffFile, isTemporaryFile } from './utils/is-file-type';
import { parentDirectory } from './utils/parent-directory';

@Injectable()
export class FilesService extends GenericCrudService<File> {
  private readonly basePath: string;

  constructor(
    @Inject(forwardRef(() => ProfessorshipsService)) private readonly professorshipsService: ProfessorshipsService,
    multerConfigService: MulterConfigService,
  ) {
    super(File);
    this.basePath = multerConfigService.basePath;
  }

  //* findAll
  protected addExtraClauses(queryBuilder: SelectQueryBuilder<File>, user?: UserIdentity) {
    queryBuilder.innerJoinAndSelect(`${queryBuilder.alias}.courses`, 'course');

    //* /files/me
    if (user) {
      queryBuilder.andWhere('owner_id = :userId', { userId: user.id });
    }

    return queryBuilder;
  }

  async findContentById(id: string, manager: EntityManager, user: UserIdentity) {
    const file = await this.getFilesRepository(manager).findOne(id, {
      withDeleted: true,
      where: { physicallyErased: false },
    });

    if (file) {
      await this.checkFindOneConditions(file, manager, user);
      return readFile(this.getFullPath(file.path));
    } else {
      this.throwCustomNotFoundException(id);
    }
  }

  //* findOne // findContentById
  protected async checkFindOneConditions(file: File, _manager: EntityManager, user: UserIdentity) {
    this.userCanReadFile(file, user);
  }

  private userCanReadFile(file: File, user: UserIdentity) {
    //* All users can read system staff and professorship files. Temporary files are only accessible by its owners, campus users and admins
    if (isTemporaryFile(file)) {
      if (isProfessorship(user) || (isStudentOrScholarship(user) && !isFileFromUser(user.id, file))) {
        throw new ForbiddenException('Prohibido el acceso al recurso.');
      }
    }
  }

  async create(createFileDto: CreateFileDto, manager: EntityManager, user: UserIdentity) {
    const filesRepository = this.getFilesRepository(manager);

    try {
      await this.checkIfUserCanUploadFiles(user, [createFileDto], manager);
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

    try {
      await this.checkIfUserCanUploadFiles(user, createFileDtos, manager);
      return filesRepository.saveAndReload(
        createFileDtos.map((createFileDto) => this.hydrateDto(createFileDto, user.role)),
      );
    } catch (error) {
      if (error instanceof ExceededAvailableStorageException) {
        await this.removeFromFS(createFileDtos.map((createFileDto) => createFileDto.path));
      }
      throw error;
    }
  }

  private async checkIfUserCanUploadFiles(user: UserIdentity, createFileDtos: CreateFileDto[], manager: EntityManager) {
    return !isProfessorship(user) || this.canProfessorshipUploadFiles(user, createFileDtos, manager);
  }

  private async canProfessorshipUploadFiles(
    user: UserIdentity,
    createFileDtos: CreateFileDto[],
    manager: EntityManager,
  ) {
    const coursesIds = new Set(flatten(createFileDtos.map((createFileDto) => createFileDto.coursesIds)));
    const professorship = await this.professorshipsService.findOne(user.id, manager, user);

    if (coursesIds.size !== 1 || !coursesIds.has(professorship.courseId)) {
      throw new BadRequestException('Professorship user cannot upload files belonging to other courses');
    } else {
      const totalSize = createFileDtos.reduce((total, file) => total + file.size, 0);
      await this.professorshipsService.useUpStorageAvailable(user.id, totalSize, manager);
    }
  }

  private hydrateDto(createFileDto: CreateFileDto, role: UserRole): DeepPartial<File> {
    return {
      ...createFileDto,
      owner: new User({ id: createFileDto.ownerId }),
      courses: createFileDto.coursesIds.map((courseId) => new Course({ id: courseId })),
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
    let file = await this.findOne(id, manager, user);

    const oldPath = file.path;

    await this.checkUpdateConditions(updateFileDto, file, manager, user);

    if (updateFileDto.name) {
      file = this.updateFilename(updateFileDto.name, file);
    }
    if (updateFileDto.coursesIds) {
      file = this.updateCoursesRelatedWithFile(updateFileDto.coursesIds, file);
    }
    this.updateFSAccordingToPath(oldPath, file.path);

    return this.getFilesRepository(manager).updateAndReload(id, file);
  }

  //* update
  protected async checkUpdateConditions(
    updateFileDto: PartialUpdateFileDto,
    file: File,
    _manager: EntityManager,
    user: UserIdentity,
  ) {
    if (isSystemProfessorshipFile(file) && updateFileDto.coursesIds) {
      throw new BadRequestException(
        'Los archivos subidos por las cátedras no pueden ver su materia asociada modificada.',
      );
    } else {
      this.userCanUpdateFile(file, user);
    }
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

  private updateFilename(newFilename: string, file: File) {
    return new File({
      ...file,
      name: newFilename,
      path: file.path.replace(basename(file.path), buildFilename(newFilename, file.mimetype)),
    });
  }

  private updateCoursesRelatedWithFile(coursesIds: string[], file: File) {
    const path = file.path;
    const copyFile = new File(file);

    const courseId = parentDirectory(path);
    if (!coursesIds.includes(courseId)) {
      copyFile.path = path.replace(courseId, coursesIds[0]);
    }
    copyFile.courses = coursesIds.map((id) => new Course({ id }));
    return copyFile;
  }

  private updateFSAccordingToPath(oldPath: string, newPath: string) {
    const fullOldPath = this.getFullPath(oldPath);
    const fullNewPath = this.getFullPath(newPath);
    const directoryNewPath = dirname(fullNewPath);
    if (!existsSync(directoryNewPath)) {
      mkdirSync(directoryNewPath);
    }
    moveSync(fullOldPath, fullNewPath);
  }

  //* remove
  protected async checkRemoveConditions(file: File, _manager: EntityManager, user: UserIdentity) {
    //! Same conditions for the moment
    this.userCanUpdateFile(file, user);
  }

  //* remove
  protected async beforeRemove(file: File, manager: EntityManager) {
    if (isSystemProfessorshipFile(file)) {
      await this.professorshipsService.topUpStorageAvailable(file.ownerId, file.size, manager);
    }
  }

  async softRemoveByCourseId(courseId: string, manager: EntityManager) {
    const filesRepository = this.getFilesRepository(manager);
    const filesToSoftRemove = [];

    //* Find first all the files that qualify to be soft removed
    //! "find" method does not work using where on a many to many relation
    const files = await filesRepository
      .createQueryBuilder('file')
      .leftJoin('file.courses', 'course')
      .where('course.id = :courseId', { courseId })
      .getMany();

    //* Once we have all the candidate files, check for each of them if they have only the course desired to be removed.
    //* In case there's one or more additional courses linked with the file, we must discard it because it's still active in the system.
    for (const file of files) {
      if ((await filesRepository.findOne(file.id, { relations: this.getFindOneRelations() })).courses.length == 1) {
        filesToSoftRemove.push(file);
      }
    }

    return filesRepository.softRemove(filesToSoftRemove);
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
    return Promise.all(paths.map((path) => remove(this.getFullPath(path))));
  }

  private getFullPath(path: string) {
    return join(this.basePath, path);
  }

  async linkFilesToProfessorship(professorship: Professorship, manager: EntityManager) {
    const filesRepository = this.getFilesRepository(manager);

    const files = await filesRepository
      .createQueryBuilder('file')
      .leftJoin('file.courses', 'course')
      .where('file.type = :type', { type: FileType.SYSTEM_PROFESSORSHIP })
      .andWhere('course.id = :id', { id: professorship.courseId })
      .withDeleted()
      .getMany();

    files.forEach((file) => (file.owner = professorship));
    return filesRepository.save(files);
  }

  async unlinkFilesFromUser(user: User, manager: EntityManager) {
    const filesRepository = this.getFilesRepository(manager);

    const files = await filesRepository.find({ where: { owner: { id: user.id } } });
    files.forEach((file) => (file.owner = null));
    await filesRepository.save(files);
  }

  @Cron(CronExpression.EVERY_DAY_AT_3AM, { name: 'fileEraser' })
  private async removeUnusedDeletedFiles() {
    const connection = getConnection();

    return connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager) => {
      const files = await manager
        .createQueryBuilder()
        .select('file')
        .distinct(true)
        .from(File, 'file')
        .leftJoin('file.orderFiles', 'orderFiles')
        .leftJoin('orderFiles.order', 'order')
        .leftJoin('order.state', 'state')
        .withDeleted()
        .where('file.deletedAt IS NOT NULL')
        .andWhere('file.physically_erased = :erased', { erased: false })
        .andWhere(
          new Brackets((qb) =>
            qb
              .where('state.code NOT IN (:...activeStates)', {
                activeStates: [EOrderState.REQUESTED, EOrderState.IN_PROCESS],
              })
              .orWhere('state.code IS NULL'),
          ),
        )
        .getMany();

      return this.removeFromFSandUpdateDB(files, manager);
    });
  }

  private getFilesRepository(manager: EntityManager) {
    return manager.getCustomRepository(FilesRepository);
  }

  protected getFindOneRelations(): string[] {
    return ['courses'];
  }

  protected throwCustomNotFoundException(id: string) {
    throw new NotFoundException(`Archivo ${id} no encontrado.`);
  }
}
