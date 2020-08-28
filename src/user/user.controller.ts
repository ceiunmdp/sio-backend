import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { InjectConnection } from '@nestjs/typeorm';
import { AutoMapper, InjectMapper } from 'nestjsx-automapper';
import { Auth } from 'src/common/decorators/auth.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';
import { Connection, EntityManager } from 'typeorm';
import { IsolationLevel } from 'typeorm-transactional-cls-hooked';
import { ResponseAdminDto } from '../users/admins/dto/response-admin.dto';
import { Admin } from '../users/admins/entities/admin.entity';
import { ResponseCampusUserDto } from '../users/campus-users/dto/response-campus-user.dto';
import { CampusUser } from '../users/campus-users/entities/campus-user.entity';
import { ResponseUserDto } from '../users/firebase-users/dto/response-user.dto';
import { UserType } from '../users/firebase-users/enums/user-type.enum';
import { ResponseProfessorshipDto } from '../users/professorships/dto/response-professorship.dto';
import { Professorship } from '../users/professorships/entities/professorship.entity';
import { ResponseScholarshipDto } from '../users/scholarships/dto/response-scholarship.dto';
import { Scholarship } from '../users/scholarships/entities/scholarship.entity';
import { ResponseStudentDto } from '../users/students/dto/response-student.dto';
import { Student } from '../users/students/entities/student.entity';
import { UserService } from './user.service';

@ApiTags('User')
@Controller()
export class UserController {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectMapper() private readonly mapper: AutoMapper,
    private readonly userService: UserService,
  ) {}

  @Get()
  @Auth(...UserRole.ALL.split(','))
  @ApiOkResponse({
    description: 'Information of currently logged in Admin/CampusUser/Professorship/Scholarship/Student',
    type: ResponseUserDto,
  })
  async find(@User('id') id: string) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager: EntityManager) => {
      const user = await this.userService.findById(id, manager);
      return this.mapUserByType(user);
    });
  }

  mapUserByType(user: Admin | CampusUser | Professorship | Scholarship | Student) {
    switch (user.type) {
      case UserType.ADMIN:
        return this.mapper.map(user, ResponseAdminDto);
      case UserType.CAMPUS:
        return this.mapper.map(user, ResponseCampusUserDto);
      case UserType.PROFESSORSHIP:
        return this.mapper.map(user, ResponseProfessorshipDto);
      case UserType.SCHOLARSHIP:
        return this.mapper.map(user, ResponseScholarshipDto);
      default:
        //* UserType.STUDENT
        return this.mapper.map(user, ResponseStudentDto);
    }
  }
}
