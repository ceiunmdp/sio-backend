import { Body, Controller } from '@nestjs/common';
import { ApiConflictResponse, ApiTags } from '@nestjs/swagger';
import { InjectConnection } from '@nestjs/typeorm';
import { CustomError } from 'src/common/classes/custom-error.class';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Filter } from 'src/common/decorators/filter.decorator';
import { Id } from 'src/common/decorators/id.decorator';
import { GetAll } from 'src/common/decorators/methods/get-all.decorator';
import { GetById } from 'src/common/decorators/methods/get-by-id.decorator';
import { PatchById } from 'src/common/decorators/methods/patch-by-id.decorator';
import { PutById } from 'src/common/decorators/methods/put-by-id.decorator';
import { Limit, Page } from 'src/common/decorators/pagination.decorator';
import { Sort } from 'src/common/decorators/sort.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { Collection } from 'src/common/enums/collection.enum';
import { Path } from 'src/common/enums/path.enum';
import { UserRole, UserRoleExpanded } from 'src/common/enums/user-role.enum';
import { CrudService } from 'src/common/interfaces/crud-service.interface';
import { Order } from 'src/common/interfaces/order.type';
import { UserIdentity } from 'src/common/interfaces/user-identity.interface';
import { Where } from 'src/common/interfaces/where.type';
import { ProxyCrudService } from 'src/common/services/proxy-crud.service';
import { AppConfigService } from 'src/config/app/app-config.service';
import { Connection } from 'typeorm';
import { PartialUpdateStudentDto } from './dto/partial-update-student.dto';
import { ResponseStudentDto } from './dto/response-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './entities/student.entity';
import { StudentsService } from './students.service';

@ApiTags('Students')
@Controller()
export class StudentsController {
  private readonly studentsService: CrudService<Student>;

  constructor(
    @InjectConnection() connection: Connection,
    private readonly appConfigService: AppConfigService,
    studentsService: StudentsService,
  ) {
    this.studentsService = new ProxyCrudService(connection, studentsService);
  }

  @GetAll(Collection.STUDENTS, ResponseStudentDto)
  @Auth(UserRole.ADMIN, UserRole.CAMPUS, ...UserRoleExpanded.STUDENT)
  async findAll(@Limit() limit: number, @Page() page: number, @Filter() where: Where, @Sort() order: Order<Student>) {
    return this.studentsService.findAll(
      {
        limit,
        page,
        route: `${this.appConfigService.basePath}${Path.USERS}${Path.STUDENTS}`,
      },
      where,
      order,
    );
  }

  @GetById(Collection.STUDENTS, ResponseStudentDto)
  @Auth(UserRole.ADMIN, UserRole.CAMPUS, ...UserRoleExpanded.STUDENT)
  async findOne(@Id() id: string, @User() user: UserIdentity) {
    return this.studentsService.findOne(id, undefined, user);
  }

  @PutById(Collection.STUDENTS, ResponseStudentDto)
  @Auth(UserRole.ADMIN)
  @ApiConflictResponse({ description: 'Email already assigned to another user.', type: CustomError })
  @ApiConflictResponse({ description: 'DNI already assigned to another user.', type: CustomError })
  async update(@Id() id: string, @Body() updateStudentDto: UpdateStudentDto, @User() user: UserIdentity) {
    return this.studentsService.update(id, updateStudentDto, undefined, user);
  }

  @PatchById(Collection.STUDENTS, ResponseStudentDto)
  @Auth(UserRole.ADMIN)
  @ApiConflictResponse({ description: 'Email already assigned to another user.', type: CustomError })
  @ApiConflictResponse({ description: 'DNI already assigned to another user.', type: CustomError })
  async partialUpdate(
    @Id() id: string,
    @Body() partialUpdateStudentDto: PartialUpdateStudentDto,
    @User() user: UserIdentity,
  ) {
    return this.studentsService.update(id, partialUpdateStudentDto, undefined, user);
  }
}
