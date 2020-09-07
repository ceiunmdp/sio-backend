import { Body, Controller } from '@nestjs/common';
import { ApiConflictResponse, ApiTags } from '@nestjs/swagger';
import { InjectConnection } from '@nestjs/typeorm';
import { CustomError } from 'src/common/classes/custom-error.class';
import { Group } from 'src/common/classes/group.class';
import { ProxyTypeOrmCrudService } from 'src/common/classes/proxy-typeorm-crud.service';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Id } from 'src/common/decorators/id.decorator';
import { GetAll } from 'src/common/decorators/methods/get-all.decorator';
import { GetById } from 'src/common/decorators/methods/get-by-id.decorator';
import { PatchById } from 'src/common/decorators/methods/patch-by-id.decorator';
import { PutById } from 'src/common/decorators/methods/put-by-id.decorator';
import { Limit, Page } from 'src/common/decorators/pagination.decorator';
import { Collection } from 'src/common/enums/collection.enum';
import { Path } from 'src/common/enums/path.enum';
import { TypeOrmCrudService } from 'src/common/interfaces/typeorm-crud-service.interface';
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
  @Auth(Group.ADMIN)
  async findAll(@Limit() limit: number, @Page() page: number) {
    return this.studentsService.findAll({
      limit,
      page,
      route: `${this.appConfigService.basePath}${Path.USERS}${Path.STUDENTS}`,
    });
  }

  @GetById(Collection.STUDENTS, ResponseStudentDto)
  @Auth(Group.ADMIN)
  async findById(@Id() id: string) {
    return this.studentsService.findById(id);
  }

  @PutById(Collection.STUDENTS, ResponseStudentDto)
  @Auth(Group.ADMIN)
  @ApiConflictResponse({ description: 'Email already assigned to another user.', type: CustomError })
  @ApiConflictResponse({ description: 'DNI already assigned to another user.', type: CustomError })
  async update(@Id() id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentsService.update(id, updateStudentDto);
  }

  @PatchById(Collection.STUDENTS, ResponseStudentDto)
  @Auth(Group.ADMIN)
  @ApiConflictResponse({ description: 'Email already assigned to another user.', type: CustomError })
  @ApiConflictResponse({ description: 'DNI already assigned to another user.', type: CustomError })
  async partialUpdate(@Id() id: string, @Body() partialUpdateStudentDto: PartialUpdateStudentDto) {
    return this.studentsService.update(id, partialUpdateStudentDto);
  }
}
