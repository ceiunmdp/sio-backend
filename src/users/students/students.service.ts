import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { ScholarshipsService } from '../scholarships/scholarships.service';
import { UsersService } from '../users/users.service';
import { GenericSubUserService } from '../utils/generic-sub-user.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './entities/student.entity';
import { StudentsRepository } from './students.repository';

@Injectable()
export class StudentsService extends GenericSubUserService<Student> {
  constructor(usersService: UsersService, private readonly scholarshipsService: ScholarshipsService) {
    super(usersService, Student);
  }

  //* This is a special method because the user is already created in Firebase
  //* The only purpose of this function is create the student entity in the database
  async create(createStudentDto: Partial<CreateStudentDto>, manager: EntityManager) {
    const studentsRepository = this.getStudentsRepository(manager);

    const student = await studentsRepository.saveAndReload(createStudentDto);

    //! Do not create user in Firebase, but instead set its custom claims
    await this.usersService.setCustomUserClaims(student);
    await this.usersService.revokeRefreshToken(student.uid);
    // TODO: Important -> Student must ask for a new ID Token with custom claims updated

    const user = await this.usersService.findById(student.id, manager);
    return this.userMerger.mergeSubUser(user, student);
  }

  async update(id: string, updateStudentDto: Partial<UpdateStudentDto>, manager: EntityManager) {
    const studentsRepository = this.getStudentsRepository(manager);

    await this.checkPreconditions(id, updateStudentDto, manager);

    const updatedStudent = await studentsRepository.saveAndReload({ ...updateStudentDto, id });

    if (!!updateStudentDto.type) {
      //* Promotion from student to scholarship
      await this.scholarshipsService.promoteStudentToScholarship(id, manager);
    }

    const user = await this.usersService.update(id, updateStudentDto, manager);
    return this.userMerger.mergeSubUser(user, updatedStudent);
  }

  private async checkPreconditions(id: string, updateStudentDto: Partial<UpdateStudentDto>, manager: EntityManager) {
    const student = await this.getStudentsRepository(manager).findOne(id);
    if (student) {
      if (
        !!updateStudentDto.dni &&
        (await this.usersService.isDniRepeated(updateStudentDto.dni, this.usersService.getUsersRepository(manager)))
      ) {
        throw new ConflictException(`Ya existe un usuario con el dni elegido.`);
      }
      return;
    } else {
      throw new NotFoundException(`Usuario estudiante ${id} no encontrado.`);
    }
  }

  //! Implemented to avoid deletion of students by error by other developers
  async delete(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  getStudentsRepository(manager: EntityManager) {
    return manager.getCustomRepository(StudentsRepository);
  }
}