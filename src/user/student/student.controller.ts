import { BadRequestException, Body, Controller, Get, Patch, Put } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { InjectConnection } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Mapper } from 'src/common/decorators/mapper.decorator';
import { BaseBodyResponses } from 'src/common/decorators/methods/responses/base-body-responses.decorator';
import { BaseResponses } from 'src/common/decorators/methods/responses/base-responses.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { Collection } from 'src/common/enums/collection.enum';
import { IsolationLevel } from 'src/common/enums/isolation-level.enum';
import { UserRoleExpanded } from 'src/common/enums/user-role.enum';
import { ResponseStudentDto } from 'src/users/students/dto/response-student.dto';
import { Connection } from 'typeorm';
import { PartialUpdateLoggedInStudentDto } from './dto/partial-update-logged-in-student.dto';
import { UpdateLoggedInStudentDto } from './dto/update-logged-in-student.dto';
import { StudentService } from './student.service';

@ApiTags(Collection.STUDENT)
@Controller()
export class StudentController {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly studentService: StudentService,
  ) {}

  @Get()
  @Auth(...UserRoleExpanded.STUDENT)
  @Mapper(ResponseStudentDto)
  @BaseResponses()
  @ApiOkResponse({ description: 'Currently logged in student', type: ResponseStudentDto })
  async findOne(@User('id') id: string) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager) => {
      return this.studentService.findOne(id, manager);
    });
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
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager) => {
      if (isUUID(id)) {
        return this.studentService.update(id, updateLoggedInStudentDto, manager);
      } else {
        throw new BadRequestException('Debe primero solicitar sus datos para poder operar luego con la entidad.');
      }
    });
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
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager) => {
      if (isUUID(id)) {
        return this.studentService.update(id, partialUpdateLoggedInStudentDto, manager);
      } else {
        throw new BadRequestException('Debe primero solicitar sus datos para poder operar luego con la entidad.');
      }
    });
  }
}
