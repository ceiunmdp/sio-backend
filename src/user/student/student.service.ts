import { Injectable, NotFoundException } from '@nestjs/common';
import { isUUID } from 'class-validator';
import { CreateStudentDto } from 'src/users/students/dto/create-student.dto';
import { Student } from 'src/users/students/entities/student.entity';
import { StudentsService } from 'src/users/students/students.service';
import { UsersService } from 'src/users/users/users.service';
import { GenericSubUserService } from 'src/users/utils/generic-sub-user.service';
import { EntityManager } from 'typeorm';
import { PartialUpdateLoggedInStudentDto } from './dto/partial-update-logged-in-student.dto';

@Injectable()
export class StudentService extends GenericSubUserService<Student> {
  constructor(usersService: UsersService, private readonly studentsService: StudentsService) {
    super(usersService, Student);
  }

  //! 'id' is Firebase's uid in case it's first student login
  async findOne(id: string, manager: EntityManager) {
    if (isUUID(id)) {
      return await this.studentsService.findOne(id, manager);
    } else {
      //* Student's first login
      //* Retrieve 'displayName' and 'email' to store them in local database
      const { displayName, email } = await this.usersService.findByUid(id);
      return this.studentsService.create(new CreateStudentDto({ uid: id, displayName, email }), manager);
    }
  }

  async update(id: string, partialUpdateLoggedInStudentDto: PartialUpdateLoggedInStudentDto, manager: EntityManager) {
    return this.studentsService.update(id, partialUpdateLoggedInStudentDto, manager);
  }

  protected throwCustomNotFoundException(id: string) {
    throw new NotFoundException(`Usuario estudiante ${id} no encontrado.`);
  }
}
