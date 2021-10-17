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
import { UserIdentity } from 'src/common/interfaces/user-identity.interface';
import { ProxyCrudService } from 'src/common/services/proxy-crud.service';
import { Scholarship } from 'src/users/scholarships/entities/scholarship.entity';
import { ScholarshipsService } from 'src/users/scholarships/scholarships.service';
import { Connection } from 'typeorm';
import { PartialUpdateLoggedInScholarshipDto } from './dto/partial-update-logged-in-scholarship.dto';
import { ResponseLoggedInScholarshipDto } from './dto/response-logged-in-scholarship.dto';
import { UpdateLoggedInScholarshipDto } from './dto/update-logged-in-scholarship.dto';

@ApiTags(Collection.SCHOLARSHIP)
@Controller()
export class ScholarshipController {
  private readonly scholarshipsService: CrudService<Scholarship>;

  constructor(@InjectConnection() connection: Connection, scholarshipsService: ScholarshipsService) {
    this.scholarshipsService = new ProxyCrudService(connection, scholarshipsService);
  }

  @Get()
  @Auth(UserRole.SCHOLARSHIP)
  @Mapper(ResponseLoggedInScholarshipDto)
  @BaseResponses()
  @ApiOkResponse({ description: 'Currently logged in scholarship', type: ResponseLoggedInScholarshipDto })
  async findOne(@User('id') id: string) {
    return this.scholarshipsService.findOne(id, undefined);
  }

  @Put()
  @Auth(UserRole.SCHOLARSHIP)
  @Mapper(ResponseLoggedInScholarshipDto)
  @BaseResponses()
  @BaseBodyResponses()
  @ApiOkResponse({
    description: 'Currently logged in scholarship updated successfully',
    type: ResponseLoggedInScholarshipDto,
  })
  async update(
    @User('id') id: string,
    @Body() updateLoggedInScholarshipDto: UpdateLoggedInScholarshipDto,
    @User() user: UserIdentity,
  ) {
    return this.scholarshipsService.update(id, updateLoggedInScholarshipDto, undefined, user);
  }

  @Patch()
  @Auth(UserRole.SCHOLARSHIP)
  @Mapper(ResponseLoggedInScholarshipDto)
  @BaseResponses()
  @BaseBodyResponses()
  @ApiOkResponse({
    description: 'Currently logged in scholarship partially updated successfully',
    type: ResponseLoggedInScholarshipDto,
  })
  async partialUpdate(
    @User('id') id: string,
    @Body() partialUpdateLoggedInScholarshipDto: PartialUpdateLoggedInScholarshipDto,
    @User() user: UserIdentity,
  ) {
    return this.scholarshipsService.update(id, partialUpdateLoggedInScholarshipDto, undefined, user);
  }
}
