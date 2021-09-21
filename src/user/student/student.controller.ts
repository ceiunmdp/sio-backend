import { Body, Controller, Get, Patch, Put } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { InjectConnection } from '@nestjs/typeorm';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Mapper } from 'src/common/decorators/mapper.decorator';
import { BaseBodyResponses } from 'src/common/decorators/methods/responses/base-body-responses.decorator';
import { BaseResponses } from 'src/common/decorators/methods/responses/base-responses.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { Collection } from 'src/common/enums/collection.enum';
import { UserRoleExpanded } from 'src/common/enums/user-role.enum';
import { CrudService } from 'src/common/interfaces/crud-service.interface';
import { UserIdentity } from 'src/common/interfaces/user-identity.interface';
import { ProxyCrudService } from 'src/common/services/proxy-crud.service';
import { Student } from 'src/users/students/entities/student.entity';
import { StudentsService } from 'src/users/students/students.service';
import { Connection } from 'typeorm';
import { PartialUpdateLoggedInStudentDto } from './dto/partial-update-logged-in-student.dto';
import { ResponseLoggedInStudentDto } from './dto/response-logged-in-student.dto';
import { UpdateLoggedInStudentDto } from './dto/update-logged-in-student.dto';

@ApiTags(Collection.STUDENT)
@Controller()
export class StudentController {
  private readonly studentsService: CrudService<Student>;

  constructor(@InjectConnection() connection: Connection, studentsService: StudentsService) {
    this.studentsService = new ProxyCrudService(connection, studentsService);
  }

  @Get()
  @Auth(...UserRoleExpanded.STUDENT)
  @Mapper(ResponseLoggedInStudentDto)
  @BaseResponses()
  @ApiOkResponse({ description: 'Currently logged in student', type: ResponseLoggedInStudentDto })
  async findOne(@User('id') id: string) {
    return this.studentsService.findOne(id, undefined);
  }

  @Put()
  @Auth(...UserRoleExpanded.STUDENT)
  @Mapper(ResponseLoggedInStudentDto)
  @BaseResponses()
  @BaseBodyResponses()
  @ApiOkResponse({
    description: 'Currently logged in student updated successfully',
    type: ResponseLoggedInStudentDto,
  })
  async update(@Body() updateLoggedInStudentDto: UpdateLoggedInStudentDto, @User() user: UserIdentity) {
    return this.studentsService.update(user.id, updateLoggedInStudentDto, undefined, user);
  }

  @Patch()
  @Auth(...UserRoleExpanded.STUDENT)
  @Mapper(ResponseLoggedInStudentDto)
  @BaseResponses()
  @BaseBodyResponses()
  @ApiOkResponse({
    description: 'Currently logged in student partially updated successfully',
    type: ResponseLoggedInStudentDto,
  })
  async partialUpdate(
    @Body() partialUpdateLoggedInStudentDto: PartialUpdateLoggedInStudentDto,
    @User() user: UserIdentity,
  ) {
    return this.studentsService.update(user.id, partialUpdateLoggedInStudentDto, undefined, user);
  }
}
