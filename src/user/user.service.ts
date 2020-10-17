import { Injectable } from '@nestjs/common';
import { isUUID } from 'class-validator';
import { CreateStudentDto } from 'src/users/students/dto/create-student.dto';
import { User } from 'src/users/users/entities/user.entity';
import { EntityManager } from 'typeorm';
import { StudentsService } from '../users/students/students.service';
import { UsersService } from '../users/users/users.service';
import { PartialUpdateLoggedInUserDto } from './dto/partial-update-logged-in-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly usersService: UsersService, private readonly studentsService: StudentsService) {}

  //! 'id' is Firebase's uid in case it's first student login
  async findOne(id: string, manager: EntityManager) {
    if (isUUID(id)) {
      return await this.usersService.findOne(id, manager);
    } else {
      //* User found in Firebase but not in database
      //* First login of student

      // Retrieve displayName to store it in local database
      const user = await this.usersService.findByUid(id);
      const student = await this.studentsService.create(
        new CreateStudentDto({ displayName: user.displayName, uid: id }),
        manager,
      );
      return new User(student);
    }
  }

  async update(id: string, partialUpdateLoggedInUserDto: PartialUpdateLoggedInUserDto, manager: EntityManager) {
    return this.usersService.update(id, partialUpdateLoggedInUserDto, manager);
  }
}
