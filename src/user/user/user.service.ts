import { Injectable } from '@nestjs/common';
import { isUUID } from 'class-validator';
import { CreateStudentDto } from 'src/users/students/dto/create-student.dto';
import { StudentsService } from 'src/users/students/students.service';
import { User } from 'src/users/users/entities/user.entity';
import { UsersService } from 'src/users/users/users.service';
import { EntityManager } from 'typeorm';
import { PartialUpdateLoggedInUserDto } from './dto/partial-update-logged-in-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly usersService: UsersService, private readonly studentsService: StudentsService) {}

  //! 'id' is Firebase's uid in case it's first student login
  async findOne(id: string, manager: EntityManager) {
    if (isUUID(id)) {
      return await this.usersService.findOne(id, manager);
    } else {
      //* Student's first login
      //* Retrieve 'displayName' and 'email' to store them in local database
      const { displayName, email } = await this.usersService.findByUid(id);
      const student = await this.studentsService.create(new CreateStudentDto({ uid: id, displayName, email }), manager);
      return new User(student);
    }
  }

  async update(id: string, partialUpdateLoggedInUserDto: PartialUpdateLoggedInUserDto, manager: EntityManager) {
    return this.usersService.update(id, partialUpdateLoggedInUserDto, manager);
  }
}
