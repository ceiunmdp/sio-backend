import { ConflictException, Injectable } from '@nestjs/common';
import { Course } from 'src/faculty-entities/courses/entities/course.entity';
import { EntityManager } from 'typeorm';
import { UsersService } from '../users/users.service';
import { GenericSubUserService } from '../utils/generic-sub-user.service';
import { CreateProfessorshipDto } from './dtos/create-professorship.dto';
import { Professorship } from './entities/professorship.entity';
import { ProfessorshipsRepository } from './professorships.repository';
@Injectable()
export class ProfessorshipsService extends GenericSubUserService<Professorship> {
  constructor(usersService: UsersService) {
    super(usersService, Professorship);
  }

  async create(createProfessorshipDto: Partial<CreateProfessorshipDto>, manager: EntityManager) {
    const professorshipsRepository = this.getProfessorshipsRepository(manager);

    if (!(await this.isCourseIdRepeated(createProfessorshipDto.courseId, professorshipsRepository))) {
      const newProfessorship = await professorshipsRepository.saveAndReload({
        ...createProfessorshipDto,
        course: new Course({ id: createProfessorshipDto.courseId }),
      });

      // TODO: Copy 'id' to 'uid' after saving entity
      await professorshipsRepository.save({ ...newProfessorship, uid: newProfessorship.id });

      const user = await this.usersService.create({ ...createProfessorshipDto, uid: newProfessorship.id }, manager);
      return this.userMerger.mergeSubUser(user, newProfessorship);
    } else {
      throw new ConflictException(`Ya existe un usuario con la materia elegida.`);
    }
  }

  private async isCourseIdRepeated(courseId: string, professorshipsRepository: ProfessorshipsRepository) {
    return !!(await professorshipsRepository.findOne({ where: { course: { id: courseId } } }));
  }

  getProfessorshipsRepository(manager: EntityManager) {
    return manager.getCustomRepository(ProfessorshipsRepository);
  }
}
