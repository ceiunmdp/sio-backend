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
import { ProxyCrudService } from 'src/common/services/proxy-crud.service';
import { ResponseStudentDto } from 'src/users/students/dto/response-student.dto';
import { Student } from 'src/users/students/entities/student.entity';
import { Connection } from 'typeorm';
import { PartialUpdateLoggedInStudentDto } from './dto/partial-update-logged-in-student.dto';
import { UpdateLoggedInStudentDto } from './dto/update-logged-in-student.dto';
import { StudentService } from './student.service';

@ApiTags(Collection.STUDENT)
@Controller()
export class StudentController {
  private readonly studentService: CrudService<Student>;

  constructor(@InjectConnection() connection: Connection, studentService: StudentService) {
    this.studentService = new ProxyCrudService(connection, studentService);
  }

  @Get()
  @Auth(...UserRoleExpanded.STUDENT)
  @Mapper(ResponseStudentDto)
  @BaseResponses()
  @ApiOkResponse({ description: 'Currently logged in student', type: ResponseStudentDto })
  async findOne(@User('id') id: string) {
    return this.studentService.findOne(id, undefined);
  }

  @Put()
  @Auth(...UserRoleExpanded.STUDENT)
  @Mapper(ResponseStudentDto)
  @BaseResponses()
  @BaseBodyResponses()
  @ApiOkResponse({
    description: 'Currently logged in student updated successfully',
    type: ResponseStudentDto,
  })
  async update(@User('id') id: string, @Body() updateLoggedInStudentDto: UpdateLoggedInStudentDto) {
    return this.studentService.update(id, updateLoggedInStudentDto, undefined);
  }

  @Patch()
  @Auth(...UserRoleExpanded.STUDENT)
  @Mapper(ResponseStudentDto)
  @BaseResponses()
  @BaseBodyResponses()
  @ApiOkResponse({
    description: 'Currently logged in student partially updated successfully',
    type: ResponseStudentDto,
  })
  async partialUpdate(
    @User('id') id: string,
    @Body() partialUpdateLoggedInStudentDto: PartialUpdateLoggedInStudentDto,
  ) {
    return this.studentService.update(id, partialUpdateLoggedInStudentDto, undefined);
  }
}
