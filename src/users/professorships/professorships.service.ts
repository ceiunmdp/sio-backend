import { ConflictException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ParameterType } from 'src/config/parameters/enums/parameter-type.enum';
import { ParametersService } from 'src/config/parameters/parameters.service';
import { Course } from 'src/faculty-entities/courses/entities/course.entity';
import { FilesService } from 'src/files/files.service';
import { EntityManager } from 'typeorm';
import { UsersService } from '../users/users.service';
import { GenericSubUserService } from '../utils/generic-sub-user.service';
import { CreateProfessorshipDto } from './dtos/create-professorship.dto';
import { Professorship } from './entities/professorship.entity';
import { ExceededAvailableStorageException } from './exceptions/exceeded-available-storage.exception';
import { ProfessorshipsRepository } from './professorships.repository';
@Injectable()
export class ProfessorshipsService extends GenericSubUserService<Professorship> {
  constructor(
    usersService: UsersService,
    @Inject(forwardRef(() => FilesService)) private readonly filesService: FilesService,
    private readonly parametersService: ParametersService,
  ) {
    super(usersService, Professorship);
  }

  async create(createProfessorshipDto: CreateProfessorshipDto, manager: EntityManager) {
    const professorshipsRepository = this.getProfessorshipsRepository(manager);

    if (!(await this.isCourseIdRepeated(createProfessorshipDto.courseId, professorshipsRepository))) {
      const newProfessorship = await professorshipsRepository.saveAndReload({
        ...createProfessorshipDto,
        availableStorage: await this.getInitialAvailableStorage(manager),
        storageUsed: 0,
        course: new Course({ id: createProfessorshipDto.courseId }),
      });

      //* Copy 'id' to 'uid' after saving entity
      await professorshipsRepository.save({ ...newProfessorship, uid: newProfessorship.id });

      const user = await this.usersService.create({ ...createProfessorshipDto, uid: newProfessorship.id }, manager);
      const professorship = this.userMerger.mergeSubUser(user, newProfessorship);

      //* Copy all updated properties altered in 'afterInsert' in the original object, without having to retrieve user again
      return Object.assign(professorship, await this.afterInsert(professorship, manager));
    } else {
      throw new ConflictException(`Ya existe un usuario cátedra con la materia elegida.`);
    }
  }

  private async getInitialAvailableStorage(manager: EntityManager) {
    return Number(
      (await this.parametersService.findByCode(ParameterType.USERS_PROFESSORSHIPS_INITIAL_AVAILABLE_STORAGE, manager))
        .value,
    );
  }

  private async afterInsert(professorship: Professorship, manager: EntityManager) {
    const professorshipsRepository = this.getProfessorshipsRepository(manager);

    const files = await this.filesService.linkFilesToProfessorship(professorship, manager);
    const storageUsed = files.reduce((storageUsed, file) => storageUsed + file.size, 0);

    return professorshipsRepository.updateAndReload(professorship.id, { ...professorship, storageUsed });
  }

  private async isCourseIdRepeated(courseId: string, professorshipsRepository: ProfessorshipsRepository) {
    return !!(await professorshipsRepository.findOne({ where: { course: { id: courseId } } }));
  }

  protected async beforeRemove(professorship: Professorship, manager: EntityManager) {
    await this.filesService.unlinkFilesFromUser(professorship, manager);
  }

  // TODO: Try to use methods developed inside this class instead of accessing repository directly
  async useUpStorageAvailable(professorshipId: string, bytes: number, manager: EntityManager) {
    const professorshipsRepository = this.getProfessorshipsRepository(manager);
    const professorship = await professorshipsRepository.findOne(professorshipId);

    if (professorship) {
      const newStorageUsed = +professorship.storageUsed + bytes;
      if (newStorageUsed > +professorship.availableStorage) {
        throw new ExceededAvailableStorageException();
      } else {
        return professorshipsRepository.updateAndReload(professorshipId, { storageUsed: newStorageUsed });
      }
    } else {
      this.throwCustomNotFoundException(professorshipId);
    }
  }

  // TODO: Try to use methods developed inside this class instead of accessing repository directly
  async topUpStorageAvailable(professorshipId: string, bytes: number, manager: EntityManager) {
    const professorshipsRepository = this.getProfessorshipsRepository(manager);
    const professorship = await professorshipsRepository.findOne(professorshipId);

    if (professorship) {
      const newStorageUsed = +professorship.storageUsed - bytes;
      return professorshipsRepository.updateAndReload(professorshipId, { storageUsed: newStorageUsed });
    } else {
      this.throwCustomNotFoundException(professorshipId);
    }
  }

  private getProfessorshipsRepository(manager: EntityManager) {
    return manager.getCustomRepository(ProfessorshipsRepository);
  }

  protected getFindOneRelations(): string[] {
    return ['course'];
  }

  protected throwCustomNotFoundException(id: string) {
    throw new NotFoundException(`Usuario cátedra ${id} no encontrado.`);
  }
}
