import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from 'src/users/students/dto/create-student.dto';
import { User } from 'src/users/users/entities/user.entity';
import { UserNotFoundInDatabaseException } from 'src/users/users/exceptions/user-not-found-in-database.exception';
import { EntityManager } from 'typeorm';
import { StudentsService } from '../users/students/students.service';
import { UsersService } from '../users/users/users.service';
import { PartialUpdateLoggedInUserDto } from './dto/partial-update-logged-in-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly usersService: UsersService, private readonly studentsService: StudentsService) {}

  //! 'id' is Firebase's uid in case it's first student login
  async findById(id: string, manager: EntityManager) {
    try {
      return this.usersService.findById(id, manager);
    } catch (error) {
      if (error instanceof UserNotFoundInDatabaseException) {
        //* User found in Firebase but not in database
        //* First login of student

        // Retrieve displayName to store it in local database
        const user = await this.usersService.findByUid(id);
        const student = await this.studentsService.create(
          new CreateStudentDto({ displayName: user.displayName, uid: id }),
          manager,
        );
        return new User(student);
      } else {
        throw error;
      }
    }
  }

  async update(id: string, partialUpdateLoggedInUserDto: PartialUpdateLoggedInUserDto, manager: EntityManager) {
    return this.usersService.update(id, partialUpdateLoggedInUserDto, manager);
  }
}
