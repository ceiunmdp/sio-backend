import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { StudentsRepository } from '../students/students.repository';
import { UserType } from '../users/enums/user-type.enum';
import { UsersService } from '../users/users.service';
import { GenericSubUserService } from '../utils/generic-sub-user.service';
import { UpdateScholarshipDto } from './dto/update-scholarship.dto';
import { Scholarship } from './entities/scholarship.entity';
import { ScholarshipsRepository } from './scholarships.repository';

@Injectable()
export class ScholarshipsService extends GenericSubUserService<Scholarship> {
  constructor(usersService: UsersService) {
    super(usersService, Scholarship);
  }

  //! Implemented to avoid creation of scholarships by error by other developers
  async create(): Promise<Scholarship> {
    throw new Error('Method not implemented.');
  }

  async update(id: string, updateScholarshipDto: Partial<UpdateScholarshipDto>, manager: EntityManager) {
    const scholarshipsRepository = manager.getCustomRepository(ScholarshipsRepository);

    const scholarship = await scholarshipsRepository.findOne(id);
    if (scholarship) {
      let updatedScholarship = await scholarshipsRepository.saveAndReload({ ...updateScholarshipDto, id });

      if (!!updateScholarshipDto.type) {
        //* Degradation from scholarship to student
        await this.degradeScholarshipToStudent(id, manager);

        //? Should this line be here or, instead, make the previous method return the updated scholarship?
        updatedScholarship = { ...updatedScholarship, availableCopies: null, remainingCopies: null };
      }

      const user = await this.usersService.update(id, updateScholarshipDto, manager);
      return this.userMerger.mergeSubUser(user, updatedScholarship);
    } else {
      throw new NotFoundException(`Usuario becado ${id} no encontrado.`);
    }
  }

  async promoteStudentToScholarship(studentId: string, manager: EntityManager) {
    const studentsRepository: StudentsRepository = manager.getCustomRepository(StudentsRepository);
    const scholarshipsRepository: ScholarshipsRepository = manager.getCustomRepository(ScholarshipsRepository);

    const student = await studentsRepository.findOne(studentId);

    //! Raw query executed. Didn't found any other workaround
    await manager.query(`UPDATE users SET type = '${UserType.SCHOLARSHIP}' WHERE id = ?`, [studentId]);

    // TODO: Decide if a 'defaults' table should be implemented
    // TODO: This way, the values wouldn't be harcoded in the database nor the environment variables
    // TODO: Ergo, no need to restart the app nor access the database records, everything is updated through UI
    return scholarshipsRepository.saveAndReload({ ...student, availableCopies: 500, remainingCopies: 500 });
  }

  private async degradeScholarshipToStudent(scholarshipId: string, manager: EntityManager) {
    await manager
      .getCustomRepository(ScholarshipsRepository)
      .save({ id: scholarshipId, availableCopies: null, remainingCopies: null });

    //! Raw query executed. Didn't found any other workaround
    await manager.query(`UPDATE users SET type = '${UserType.STUDENT}' WHERE id = ?`, [scholarshipId]);

    return manager.getCustomRepository(StudentsRepository).findOne(scholarshipId);
  }

  //! Implemented to avoid deletion of scholarships by error by other developers
  async delete(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
