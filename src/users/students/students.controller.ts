import { Body, Controller, ParseArrayPipe, Patch, Put } from '@nestjs/common';
import { ApiBody, ApiConflictResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { InjectConnection } from '@nestjs/typeorm';
import { CustomError } from 'src/common/classes/custom-error.class';
import { ID_AS_UUID_V4 } from 'src/common/constants/regular-expressions.constant';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Filter } from 'src/common/decorators/filter.decorator';
import { Id } from 'src/common/decorators/id.decorator';
import { Mapper } from 'src/common/decorators/mapper.decorator';
import { GetAll } from 'src/common/decorators/methods/get-all.decorator';
import { GetById } from 'src/common/decorators/methods/get-by-id.decorator';
import { PatchById } from 'src/common/decorators/methods/patch-by-id.decorator';
import { PutById } from 'src/common/decorators/methods/put-by-id.decorator';
import { BaseBodyResponses } from 'src/common/decorators/methods/responses/base-body-responses.decorator';
import { BaseResponses } from 'src/common/decorators/methods/responses/base-responses.decorator';
import { Limit, Page } from 'src/common/decorators/pagination.decorator';
import { Sort } from 'src/common/decorators/sort.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { Collection } from 'src/common/enums/collection.enum';
import { IsolationLevel } from 'src/common/enums/isolation-level.enum';
import { Path } from 'src/common/enums/path.enum';
import { UserRole, UserRoleExpanded } from 'src/common/enums/user-role.enum';
import { CrudService } from 'src/common/interfaces/crud-service.interface';
import { Order } from 'src/common/interfaces/order.type';
import { UserIdentity } from 'src/common/interfaces/user-identity.interface';
import { Where } from 'src/common/interfaces/where.type';
import { ProxyCrudService } from 'src/common/services/proxy-crud.service';
import { AppConfigService } from 'src/config/app/app-config.service';
import { Connection } from 'typeorm';
import { PartialUpdateStudentBulkDto } from './dto/partial-update-student-bulk.dto';
import { PartialUpdateStudentDto } from './dto/partial-update-student.dto';
import { ResponseStudentDto } from './dto/response-student.dto';
import { UpdateStudentBulkDto } from './dto/update-student-bulk.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './entities/student.entity';
import { StudentsService } from './students.service';

@ApiTags(Collection.STUDENTS)
@Controller()
export class StudentsController {
  private readonly studentsServiceProxy: CrudService<Student>;

  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly appConfigService: AppConfigService,
    private readonly studentsService: StudentsService,
  ) {
    this.studentsServiceProxy = new ProxyCrudService(connection, studentsService);
  }

  @GetAll(Collection.STUDENTS, ResponseStudentDto)
  @Auth(UserRole.ADMIN, UserRole.CAMPUS, ...UserRoleExpanded.STUDENT)
  async findAll(@Limit() limit: number, @Page() page: number, @Filter() where: Where, @Sort() order: Order<Student>) {
    return this.studentsServiceProxy.findAll(
      {
        limit,
        page,
        route: `${this.appConfigService.basePath}${Path.USERS}${Path.STUDENTS}`,
      },
      where,
      order,
    );
  }

  @GetById(Collection.STUDENTS, ResponseStudentDto, ID_AS_UUID_V4)
  @Auth(UserRole.ADMIN, UserRole.CAMPUS, ...UserRoleExpanded.STUDENT)
  async findOne(@Id() id: string, @User() user: UserIdentity) {
    return this.studentsServiceProxy.findOne(id, undefined, user);
  }

  @GetById(Collection.STUDENTS, ResponseStudentDto)
  @Auth(UserRole.ADMIN, UserRole.CAMPUS, ...UserRoleExpanded.STUDENT)
  async findOneByDni(@Id() id: string, @User() user: UserIdentity) {
    return this.studentsServiceProxy.findOne(id, undefined, user);
  }

  @PutById(Collection.STUDENTS, ResponseStudentDto, ID_AS_UUID_V4)
  @Auth(UserRole.ADMIN)
  @ApiConflictResponse({ description: 'Email already assigned to another user.', type: CustomError })
  @ApiConflictResponse({ description: 'DNI already assigned to another user.', type: CustomError })
  async update(@Id() id: string, @Body() updateStudentDto: UpdateStudentDto, @User() user: UserIdentity) {
    return this.studentsServiceProxy.update(id, updateStudentDto, undefined, user);
  }

  @Put('/bulk')
  @Auth(UserRole.ADMIN)
  @Mapper(ResponseStudentDto)
  @ApiBody({ description: 'List of students to update.', type: [UpdateStudentBulkDto] })
  @BaseResponses()
  @BaseBodyResponses()
  @ApiOkResponse({
    description: 'The students have been successfully updated.',
    type: [ResponseStudentDto],
  })
  @ApiConflictResponse({ description: 'Email already assigned to another user.', type: CustomError })
  @ApiConflictResponse({ description: 'DNI already assigned to another user.', type: CustomError })
  async updateBulk(
    @Body(new ParseArrayPipe({ items: UpdateStudentBulkDto })) updateStudentsBulkDto: UpdateStudentBulkDto[],
    @User() user: UserIdentity,
  ) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager) => {
      return this.studentsService.updateBulk(updateStudentsBulkDto, manager, user);
    });
  }

  @PatchById(Collection.STUDENTS, ResponseStudentDto, ID_AS_UUID_V4)
  @Auth(UserRole.ADMIN)
  @ApiConflictResponse({ description: 'Email already assigned to another user.', type: CustomError })
  @ApiConflictResponse({ description: 'DNI already assigned to another user.', type: CustomError })
  async partialUpdate(
    @Id() id: string,
    @Body() partialUpdateStudentDto: PartialUpdateStudentDto,
    @User() user: UserIdentity,
  ) {
    return this.studentsServiceProxy.update(id, partialUpdateStudentDto, undefined, user);
  }

  @Patch('/bulk')
  @Auth(UserRole.ADMIN)
  @Mapper(ResponseStudentDto)
  @ApiBody({ description: 'List of students to partially update.', type: [PartialUpdateStudentBulkDto] })
  @BaseResponses()
  @BaseBodyResponses()
  @ApiOkResponse({
    description: 'The students have been successfully partially updated.',
    type: [ResponseStudentDto],
  })
  @ApiConflictResponse({ description: 'Email already assigned to another user.', type: CustomError })
  @ApiConflictResponse({ description: 'DNI already assigned to another user.', type: CustomError })
  async partialUpdateBulk(
    @Body(new ParseArrayPipe({ items: PartialUpdateStudentBulkDto }))
    partialUpdateStudentsBulkDto: PartialUpdateStudentBulkDto[],
    @User() user: UserIdentity,
  ) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager) => {
      return this.studentsService.updateBulk(partialUpdateStudentsBulkDto, manager, user);
    });
  }
}
