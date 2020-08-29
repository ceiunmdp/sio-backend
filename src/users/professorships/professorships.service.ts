import { ConflictException, Injectable } from '@nestjs/common';
import { EmailAlreadyExistsException } from 'src/common/exceptions/email-already-exists.exception';
import { Course } from 'src/faculty-entities/courses/entities/course.entity';
import { EntityManager } from 'typeorm';
import { UsersService } from '../users/users.service';
import { GenericSubUserService } from '../utils/generic-sub-user.service';
import { CreateProfessorshipDto } from './dto/create-professorship.dto';
import { Professorship } from './entities/professorship.entity';
import { ProfessorshipsRepository } from './professorships.repository';
@Injectable()
export class ProfessorshipsService extends GenericSubUserService<Professorship> {
  constructor(usersService: UsersService) {
    super(usersService, Professorship);
  }

  async create(createProfessorshipDto: Partial<CreateProfessorshipDto>, manager: EntityManager) {
    const professorshipsRepository = manager.getCustomRepository(ProfessorshipsRepository);

    let professorship = await professorshipsRepository.findOne({
      where: { course: { id: createProfessorshipDto.courseId } },
      withDeleted: true,
    });

    if (!professorship) {
      const newProfessorship = await professorshipsRepository.saveAndReload({
        ...createProfessorshipDto,
        course: new Course({ id: createProfessorshipDto.courseId }),
      });

      try {
        const user = await this.usersService.create(newProfessorship.id, createProfessorshipDto, manager);
        return this.userMerger.mergeSubUser(user, newProfessorship);
      } catch (error) {
        if (error instanceof EmailAlreadyExistsException) {
          throw new ConflictException(`Ya existe un usuario con el email elegido.`);
        } else {
          throw error;
        }
      }
    } else if (professorship.deleteDate) {
      professorship = await professorshipsRepository.recover(professorship);
      return this.userMerger.findAndMergeSubUser(professorship, manager);
    } else {
      throw new ConflictException(`Ya existe un usuario con la materia elegida.`);
    }
  }
}
