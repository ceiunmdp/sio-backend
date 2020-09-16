import { ConflictException, Injectable } from '@nestjs/common';
import { Course } from 'src/faculty-entities/courses/entities/course.entity';
import { FilesService } from 'src/files/files.service';
import { EntityManager } from 'typeorm';
import { UsersService } from '../users/users.service';
import { GenericSubUserService } from '../utils/generic-sub-user.service';
import { CreateProfessorshipDto } from './dtos/create-professorship.dto';
import { Professorship } from './entities/professorship.entity';
import { ProfessorshipsRepository } from './professorships.repository';
@Injectable()
export class ProfessorshipsService extends GenericSubUserService<Professorship> {
  constructor(usersService: UsersService, private readonly filesService: FilesService) {
    super(usersService, Professorship);
  }

  async create(createProfessorshipDto: Partial<CreateProfessorshipDto>, manager: EntityManager) {
    const professorshipsRepository = this.getProfessorshipsRepository(manager);

    if (!(await this.isCourseIdRepeated(createProfessorshipDto.courseId, professorshipsRepository))) {
      const newProfessorship = await professorshipsRepository.saveAndReload({
        ...createProfessorshipDto,
        course: new Course({ id: createProfessorshipDto.courseId }),
      });

      //* Copy 'id' to 'uid' after saving entity
      await professorshipsRepository.save({ ...newProfessorship, uid: newProfessorship.id });

      const user = await this.usersService.create({ ...createProfessorshipDto, uid: newProfessorship.id }, manager);
      const professorship = this.userMerger.mergeSubUser(user, newProfessorship);

      //* Copy all updated properties altered in 'afterInsert' in the original object, without having to retrieve user again
      return Object.assign(professorship, await this.afterInsert(professorship, manager));
    } else {
      throw new ConflictException(`Ya existe un usuario con la materia elegida.`);
    }
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
    await this.filesService.unlinkFilesFromProfessorship(professorship, manager);
  }

  private getProfessorshipsRepository(manager: EntityManager) {
    return manager.getCustomRepository(ProfessorshipsRepository);
  }

  protected getCustomMessageNotFoundException(id: string): string {
    return `Usuario cátedra ${id} no encontrado.`;
  }
}
