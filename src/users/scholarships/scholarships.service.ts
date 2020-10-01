import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ParameterType } from 'src/config/parameters/enums/parameter-type.enum';
import { ParametersService } from 'src/config/parameters/parameters.service';
import { EntityManager } from 'typeorm';
import { StudentsRepository } from '../students/students.repository';
import { UserType } from '../users/enums/user-type.enum';
import { UsersService } from '../users/users.service';
import { GenericSubUserService } from '../utils/generic-sub-user.service';
import { PartialUpdateScholarshipDto } from './dtos/partial-update-scholarship.dto';
import { Scholarship } from './entities/scholarship.entity';
import { ScholarshipsRepository } from './scholarships.repository';

@Injectable()
export class ScholarshipsService extends GenericSubUserService<Scholarship> {
  constructor(usersService: UsersService, private readonly parametersService: ParametersService) {
    super(usersService, Scholarship);
  }

  //! Implemented to avoid creation of scholarships by error by other developers
  async create(): Promise<Scholarship> {
    throw new Error('Method not implemented.');
  }

  async update(id: string, updateScholarshipDto: PartialUpdateScholarshipDto, manager: EntityManager) {
    const scholarshipsRepository = this.getScholarshipsRepository(manager);

    await this.checkUpdateConditions(id, updateScholarshipDto, manager);

    let updatedScholarship = await scholarshipsRepository.updateAndReload(id, updateScholarshipDto);

    if (updateScholarshipDto.type) {
      //* Degradation from scholarship to student
      await this.degradeScholarshipToStudent(id, manager);

      //? Should this line be here or, instead, make the previous method return the updated scholarship?
      updatedScholarship = { ...updatedScholarship, availableCopies: null, remainingCopies: null };
    }

    const user = await this.usersService.update(id, updateScholarshipDto, manager);
    return this.userMerger.mergeSubUser(user, updatedScholarship);
  }

  private async checkUpdateConditions(
    id: string,
    updateScholarshipDto: PartialUpdateScholarshipDto,
    manager: EntityManager,
  ) {
    const scholarship = await this.getScholarshipsRepository(manager).findOne(id);
    if (scholarship) {
      if (
        updateScholarshipDto.dni &&
        (await this.usersService.isDniRepeated(updateScholarshipDto.dni, this.usersService.getUsersRepository(manager)))
      ) {
        throw new ConflictException(`Ya existe un usuario con el dni elegido.`);
      }
      return;
    } else {
      this.throwCustomNotFoundException(id);
    }
  }

  async promoteStudentToScholarship(studentId: string, manager: EntityManager) {
    //! Raw query executed. Didn't found any other workaround
    await manager.query(`UPDATE users SET type = '${UserType.SCHOLARSHIP}' WHERE id = ?`, [studentId]);

    const initialAvailableCopies = await this.getInitialAvailableCopies(manager);
    const updatedScholarship = await this.getScholarshipsRepository(manager).updateAndReload(studentId, {
      availableCopies: initialAvailableCopies,
      remainingCopies: initialAvailableCopies,
    });

    await this.usersService.setRole(updatedScholarship, manager);
    return updatedScholarship;
  }

  private async getInitialAvailableCopies(manager: EntityManager) {
    const parameter = await this.parametersService.findByCode(
      ParameterType.USERS_SCHOLARSHIPS_INITIAL_AVAILABLE_COPIES,
      manager,
    );

    return parameter.value;
  }

  private async degradeScholarshipToStudent(scholarshipId: string, manager: EntityManager) {
    await this.getScholarshipsRepository(manager).update(scholarshipId, {
      availableCopies: null,
      remainingCopies: null,
    });

    //! Raw query executed. Didn't found any other workaround
    await manager.query(`UPDATE users SET type = '${UserType.STUDENT}' WHERE id = ?`, [scholarshipId]);

    const student = await manager.getCustomRepository(StudentsRepository).findOne(scholarshipId);
    await this.usersService.setRole(student, manager);
    return student;
  }

  //! Implemented to avoid deletion of scholarships by error by other developers
  async remove(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  private getScholarshipsRepository(manager: EntityManager) {
    return manager.getCustomRepository(ScholarshipsRepository);
  }

  protected throwCustomNotFoundException(id: string) {
    throw new NotFoundException(`Usuario becado ${id} no encontrado.`);
  }
}
