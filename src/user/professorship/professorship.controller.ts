import { Body, Controller, Get, Patch, Put } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { InjectConnection } from '@nestjs/typeorm';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Mapper } from 'src/common/decorators/mapper.decorator';
import { BaseBodyResponses } from 'src/common/decorators/methods/responses/base-body-responses.decorator';
import { BaseResponses } from 'src/common/decorators/methods/responses/base-responses.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { IsolationLevel } from 'src/common/enums/isolation-level.enum';
import { UserRole } from 'src/common/enums/user-role.enum';
import { ResponseProfessorshipDto } from 'src/users/professorships/dtos/response-professorship.dto';
import { ProfessorshipsService } from 'src/users/professorships/professorships.service';
import { Connection } from 'typeorm';
import { PartialUpdateLoggedInProfessorshipDto } from './dto/partial-update-logged-in-professorship.dto';
import { UpdateLoggedInProfessorshipDto } from './dto/update-logged-in-professorship.dto';

@ApiTags('Professorship')
@Controller()
export class ProfessorshipController {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly professorshipsService: ProfessorshipsService,
  ) {}

  @Get()
  @Auth(UserRole.PROFESSORSHIP)
  @Mapper(ResponseProfessorshipDto)
  @BaseResponses()
  @ApiOkResponse({ description: 'Currently logged in professorship', type: ResponseProfessorshipDto })
  async findOne(@User('id') id: string) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager) => {
      return this.professorshipsService.findOne(id, manager);
    });
  }

  @Put()
  @Auth(UserRole.PROFESSORSHIP)
  @Mapper(ResponseProfessorshipDto)
  @BaseResponses()
  @BaseBodyResponses()
  @ApiOkResponse({
    description: 'Currently logged in professorship updated successfully',
    type: ResponseProfessorshipDto,
  })
  async update(@User('id') id: string, @Body() updateLoggedInProfessorshipDto: UpdateLoggedInProfessorshipDto) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager) => {
      return this.professorshipsService.update(id, updateLoggedInProfessorshipDto, manager);
    });
  }

  @Patch()
  @Auth(UserRole.PROFESSORSHIP)
  @Mapper(ResponseProfessorshipDto)
  @BaseResponses()
  @BaseBodyResponses()
  @ApiOkResponse({
    description: 'Currently logged in professorship partially updated successfully',
    type: ResponseProfessorshipDto,
  })
  async partialUpdate(
    @User('id') id: string,
    @Body() partialUpdateLoggedInProfessorshipDto: PartialUpdateLoggedInProfessorshipDto,
  ) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager) => {
      return this.professorshipsService.update(id, partialUpdateLoggedInProfessorshipDto, manager);
    });
  }
}
