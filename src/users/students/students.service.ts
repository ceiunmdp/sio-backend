import { ConflictException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserIdentity } from 'src/common/interfaces/user-identity.interface';
import { ParameterType } from 'src/config/parameters/enums/parameter-type.enum';
import { ParametersService } from 'src/config/parameters/parameters.service';
import { EntityManager } from 'typeorm';
import { ScholarshipsService } from '../scholarships/scholarships.service';
import { UsersService } from '../users/users.service';
import { GenericSubUserService } from '../utils/generic-sub-user.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { PartialUpdateStudentBulkDto } from './dto/partial-update-student-bulk.dto';
import { PartialUpdateStudentDto } from './dto/partial-update-student.dto';
import { Student } from './entities/student.entity';
import { InsufficientMoneyException } from './exceptions/insufficient-money.exception';
import { StudentsRepository } from './students.repository';

@Injectable()
export class StudentsService extends GenericSubUserService<Student> {
  constructor(
    usersService: UsersService,
    private readonly parametersService: ParametersService,
    @Inject(forwardRef(() => ScholarshipsService)) private readonly scholarshipsService: ScholarshipsService,
  ) {
    super(usersService, Student);
  }

  //* This is a special method because the user is already created in Firebase
  //* The only purpose of this function is create the student entity in the database
  async create(createStudentDto: CreateStudentDto, manager: EntityManager) {
    const studentsRepository = this.getStudentsRepository(manager);

    const student = await studentsRepository.saveAndReload({ ...createStudentDto, balance: 0 });

    const user = await this.usersService.findOne(student.id, manager);
    return this.userMerger.mergeSubUser(user, student);
  }

  async update(
    id: string,
    updateStudentDto: PartialUpdateStudentDto,
    manager: EntityManager,
    userIdentity: UserIdentity,
  ) {
    const student = await this.findOne(id, manager, userIdentity);

    await this.checkUpdateConditions(updateStudentDto, student, manager);

    const updatedStudent = await this.getStudentsRepository(manager).updateAndReload(id, updateStudentDto);

    if (updateStudentDto.type) {
      //* Promotion from student to scholarship
      await this.scholarshipsService.promoteStudentToScholarship(id, manager);
    }

    const user = await this.usersService.update(id, updateStudentDto, manager, userIdentity);
    return this.userMerger.mergeSubUser(user, updatedStudent);
  }

  async updateBulk(
    partialUpdateStudentsBulkDto: PartialUpdateStudentBulkDto[],
    manager: EntityManager,
    user: UserIdentity,
  ) {
    return Promise.all(partialUpdateStudentsBulkDto.map((student) => this.update(student.id, student, manager, user)));
  }

  protected async checkUpdateConditions(
    updateStudentDto: PartialUpdateStudentDto,
    student: Student,
    manager: EntityManager,
  ) {
    if (
      updateStudentDto.dni &&
      updateStudentDto.dni !== student.dni &&
      (await this.usersService.isDniRepeated(updateStudentDto.dni, manager))
    ) {
      throw new ConflictException(`Ya existe un usuario con el DNI elegido.`);
    }
  }

  //! Implemented to avoid deletion of students by error by other developers
  async remove(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async useUpBalance(
    studentId: string,
    amount: number,
    allowNegativeBalanceConsumption: boolean,
    manager: EntityManager,
  ) {
    const studentsRepository = this.getStudentsRepository(manager);
    const student = await studentsRepository.findOne(studentId);

    if (student) {
      const availableBalance = allowNegativeBalanceConsumption
        ? student.balance + Math.abs(await this.getMinimumBalanceAllowed(manager))
        : student.balance;
      if (availableBalance >= amount) {
        return studentsRepository.updateAndReload(studentId, { ...student, balance: student.balance - amount });
      } else {
        throw new InsufficientMoneyException();
      }
    } else {
      this.throwCustomNotFoundException(studentId);
    }
  }

  async topUpBalance(studentId: string, amount: number, manager: EntityManager) {
    const studentsRepository = this.getStudentsRepository(manager);
    const student = await studentsRepository.findOne(studentId);

    if (student) {
      return studentsRepository.updateAndReload(studentId, { ...student, balance: student.balance + amount });
    } else {
      this.throwCustomNotFoundException(studentId);
    }
  }

  private async getMinimumBalanceAllowed(manager: EntityManager) {
    return Number(
      (await this.parametersService.findByCode(ParameterType.USERS_MINIMUM_BALANCE_ALLOWED, manager)).value,
    );
  }

  private getStudentsRepository(manager: EntityManager) {
    return manager.getCustomRepository(StudentsRepository);
  }

  protected throwCustomNotFoundException(id: string) {
    throw new NotFoundException(`Usuario estudiante ${id} no encontrado.`);
  }
}
