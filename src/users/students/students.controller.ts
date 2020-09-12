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
import { Collection } from 'src/common/enums/collection.enum';
import { Path } from 'src/common/enums/path.enum';
import { UserRole } from 'src/common/enums/user-role.enum';
import { Order } from 'src/common/interfaces/order.type';
import { TypeOrmCrudService } from 'src/common/interfaces/typeorm-crud-service.interface';
import { Where } from 'src/common/interfaces/where.type';
import { ProxyTypeOrmCrudService } from 'src/common/services/proxy-typeorm-crud.service';
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
  private readonly studentsService: TypeOrmCrudService<Student>;

  constructor(
    @InjectConnection() connection: Connection,
    private readonly appConfigService: AppConfigService,
    studentsService: StudentsService,
  ) {
    this.studentsService = new ProxyTypeOrmCrudService(connection, studentsService);
  }

  @GetAll(Collection.STUDENTS, ResponseStudentDto)
  @Auth(UserRole.ADMIN, UserRole.STUDENT, UserRole.SCHOLARSHIP)
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
  @Auth(UserRole.ADMIN, UserRole.STUDENT, UserRole.SCHOLARSHIP)
  async findById(@Id() id: string) {
    return this.studentsService.findById(id);
  }

  @PutById(Collection.STUDENTS, ResponseStudentDto)
  @Auth(UserRole.ADMIN)
  @ApiConflictResponse({ description: 'Email already assigned to another user.', type: CustomError })
  @ApiConflictResponse({ description: 'DNI already assigned to another user.', type: CustomError })
  async update(@Id() id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentsService.update(id, updateStudentDto);
  }

  @PatchById(Collection.STUDENTS, ResponseStudentDto)
  @Auth(UserRole.ADMIN)
  @ApiConflictResponse({ description: 'Email already assigned to another user.', type: CustomError })
  @ApiConflictResponse({ description: 'DNI already assigned to another user.', type: CustomError })
  async partialUpdate(@Id() id: string, @Body() partialUpdateStudentDto: PartialUpdateStudentDto) {
    return this.studentsService.update(id, partialUpdateStudentDto);
  }
}
