import { ConflictException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { ScholarshipsService } from '../scholarships/scholarships.service';
import { UsersService } from '../users/users.service';
import { GenericSubUserService } from '../utils/generic-sub-user.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { PartialUpdateStudentDto } from './dto/partial-update-student.dto';
import { Student } from './entities/student.entity';
import { InsufficientMoneyException } from './exceptions/insufficient-money.exception';
import { StudentsRepository } from './students.repository';

@Injectable()
export class StudentsService extends GenericSubUserService<Student> {
  constructor(
    usersService: UsersService,
    @Inject(forwardRef(() => ScholarshipsService)) private readonly scholarshipsService: ScholarshipsService,
  ) {
    super(usersService, Student);
  }

  //* This is a special method because the user is already created in Firebase
  //* The only purpose of this function is create the student entity in the database
  async create(createStudentDto: CreateStudentDto, manager: EntityManager) {
    const studentsRepository = this.getStudentsRepository(manager);

    const student = await studentsRepository.saveAndReload({ ...createStudentDto, balance: 0 });

    //! Do not create user in Firebase, but instead set its custom claims
    await this.usersService.setRole(student, manager);
    //! Important: student must ask for a new ID Token with custom claims updated

    const user = await this.usersService.findOne(student.id, manager);
    return this.userMerger.mergeSubUser(user, student);
  }

  async update(id: string, updateStudentDto: PartialUpdateStudentDto, manager: EntityManager) {
    const studentsRepository = this.getStudentsRepository(manager);

    await this.checkUpdateConditions(id, updateStudentDto, manager);

    const updatedStudent = await studentsRepository.updateAndReload(id, updateStudentDto);

    if (updateStudentDto.type) {
      //* Promotion from student to scholarship
      await this.scholarshipsService.promoteStudentToScholarship(id, manager);
    }

    const user = await this.usersService.update(id, updateStudentDto, manager);
    return this.userMerger.mergeSubUser(user, updatedStudent);
  }

  private async checkUpdateConditions(id: string, updateStudentDto: PartialUpdateStudentDto, manager: EntityManager) {
    const student = await this.getStudentsRepository(manager).findOne(id);
    if (student) {
      if (
        updateStudentDto.dni &&
        (await this.usersService.isDniRepeated(updateStudentDto.dni, this.usersService.getUsersRepository(manager)))
      ) {
        throw new ConflictException(`Ya existe un usuario con el dni elegido.`);
      }
      return;
    } else {
      this.throwCustomNotFoundException(id);
    }
  }

  //! Implemented to avoid deletion of students by error by other developers
  async remove(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async useUpBalance(studentId: string, amount: number, manager: EntityManager) {
    const studentsRepository = this.getStudentsRepository(manager);
    const student = await studentsRepository.findOne(studentId);

    if (student) {
      if (student.balance >= amount) {
        return studentsRepository.updateAndReload(studentId, { ...student, balance: +student.balance - amount });
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
      return studentsRepository.updateAndReload(studentId, { ...student, balance: +student.balance + amount });
    } else {
      this.throwCustomNotFoundException(studentId);
    }
  }

  private getStudentsRepository(manager: EntityManager) {
    return manager.getCustomRepository(StudentsRepository);
  }

  protected throwCustomNotFoundException(id: string) {
    throw new NotFoundException(`Usuario estudiante ${id} no encontrado.`);
  }
}
