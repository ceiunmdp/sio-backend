import { Body, Controller, Get, Patch, Put } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { InjectConnection } from '@nestjs/typeorm';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Mapper } from 'src/common/decorators/mapper.decorator';
import { BaseBodyResponses } from 'src/common/decorators/methods/responses/base-body-responses.decorator';
import { BaseResponses } from 'src/common/decorators/methods/responses/base-responses.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { Collection } from 'src/common/enums/collection.enum';
import { UserRole } from 'src/common/enums/user-role.enum';
import { CrudService } from 'src/common/interfaces/crud-service.interface';
import { ProxyCrudService } from 'src/common/services/proxy-crud.service';
import { ResponseProfessorshipDto } from 'src/users/professorships/dtos/response-professorship.dto';
import { Professorship } from 'src/users/professorships/entities/professorship.entity';
import { ProfessorshipsService } from 'src/users/professorships/professorships.service';
import { Connection } from 'typeorm';
import { PartialUpdateLoggedInProfessorshipDto } from './dto/partial-update-logged-in-professorship.dto';
import { UpdateLoggedInProfessorshipDto } from './dto/update-logged-in-professorship.dto';

@ApiTags(Collection.PROFESSORSHIP)
@Controller()
export class ProfessorshipController {
  private readonly professorshipsService: CrudService<Professorship>;

  constructor(@InjectConnection() connection: Connection, professorshipsService: ProfessorshipsService) {
    this.professorshipsService = new ProxyCrudService(connection, professorshipsService);
  }

  @Get()
  @Auth(UserRole.PROFESSORSHIP)
  @Mapper(ResponseProfessorshipDto)
  @BaseResponses()
  @ApiOkResponse({ description: 'Currently logged in professorship', type: ResponseProfessorshipDto })
  async findOne(@User('id') id: string) {
    return this.professorshipsService.findOne(id, undefined);
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
    return this.professorshipsService.update(id, updateLoggedInProfessorshipDto, undefined);
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
    return this.professorshipsService.update(id, partialUpdateLoggedInProfessorshipDto, undefined);
  }
}
