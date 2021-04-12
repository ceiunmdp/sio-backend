import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findOne(id: string, manager: EntityManager) {
    return await this.studentsService.findOne(id, manager);
  }

  async update(id: string, partialUpdateLoggedInStudentDto: PartialUpdateLoggedInStudentDto, manager: EntityManager) {
    return this.studentsService.update(id, partialUpdateLoggedInStudentDto, manager);
  }

  protected throwCustomNotFoundException(id: string) {
    throw new NotFoundException(`Usuario estudiante ${id} no encontrado.`);
  }
}
