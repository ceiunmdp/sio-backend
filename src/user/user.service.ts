import { Injectable } from '@nestjs/common';
import { UserNotFoundInDatabaseException } from 'src/common/exceptions/user-not-found-in-database.exception';
import { EntityManager } from 'typeorm';
import { AdminsService } from '../users/admins/admins.service';
import { Admin } from '../users/admins/entities/admin.entity';
import { CampusUsersService } from '../users/campus-users/campus-users.service';
import { CampusUser } from '../users/campus-users/entities/campus-user.entity';
import { Professorship } from '../users/professorships/entities/professorship.entity';
import { ProfessorshipsService } from '../users/professorships/professorships.service';
import { Scholarship } from '../users/scholarships/entities/scholarship.entity';
import { ScholarshipsService } from '../users/scholarships/scholarships.service';
import { Student } from '../users/students/entities/student.entity';
import { StudentsService } from '../users/students/students.service';
import { UserType } from '../users/users/enums/user-type.enum';
import { UsersService } from '../users/users/users.service';

@Injectable()
export class UserService {
  constructor(
    private readonly usersService: UsersService,
    private readonly adminsService: AdminsService,
    private readonly campusUsersService: CampusUsersService,
    private readonly professorshipsService: ProfessorshipsService,
    private readonly scholarshipsService: ScholarshipsService,
    private readonly studentsService: StudentsService,
  ) {}

  //! 'id' is Firebase's uid in case it's first student login
  async findById(id: string, manager: EntityManager) {
    try {
      const user = await this.usersService.findById(id, manager);
      return this.findByIdAndType(user.id, user.type, manager);
    } catch (error) {
      if (error instanceof UserNotFoundInDatabaseException) {
        //* User found in Firebase but not in database
        //* First login of student

        // Retrieve displayName to store it in local database
        const user = await this.usersService.findByUid(id);
        return this.studentsService.create({ displayName: user.displayName, uid: id }, manager);
      } else {
        throw error;
      }
    }
  }

  private findByIdAndType(
    id: string,
    type: UserType,
    manager: EntityManager,
  ): Promise<Admin> | Promise<CampusUser> | Promise<Professorship> | Promise<Scholarship> | Promise<Student> {
    switch (type) {
      case UserType.ADMIN:
        return this.adminsService.findById(id, manager);
      case UserType.CAMPUS:
        return this.campusUsersService.findById(id, manager);
      case UserType.PROFESSORSHIP:
        return this.professorshipsService.findById(id, manager);
      case UserType.SCHOLARSHIP:
        return this.scholarshipsService.findById(id, manager);
      default:
        //* UserType.STUDENT
        return this.studentsService.findById(id, manager);
    }
  }
}
