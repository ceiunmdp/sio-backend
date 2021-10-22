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
import { CampusUsersService } from 'src/users/campus-users/campus-users.service';
import { ResponseCampusUserDto } from 'src/users/campus-users/dtos/response-campus-user.dto';
import { CampusUser } from 'src/users/campus-users/entities/campus-user.entity';
import { Connection } from 'typeorm';
import { PartialUpdateLoggedInCampusUserDto } from './dto/partial-update-logged-in-campus-user.dto';
import { UpdateLoggedInCampusUserDto } from './dto/update-logged-in-campus-user.dto';

@ApiTags(Collection.CAMPUS_USER)
@Controller()
export class CampusUserController {
  private readonly campusUsersService: CrudService<CampusUser>;

  constructor(@InjectConnection() connection: Connection, campusUsersService: CampusUsersService) {
    this.campusUsersService = new ProxyCrudService(connection, campusUsersService);
  }

  @Get()
  @Auth(UserRole.CAMPUS)
  @Mapper(ResponseCampusUserDto)
  @BaseResponses()
  @ApiOkResponse({ description: 'Currently logged in campus user', type: ResponseCampusUserDto })
  async findOne(@User('id') id: string) {
    return this.campusUsersService.findOne(id, undefined);
  }

  @Put()
  @Auth(UserRole.CAMPUS)
  @Mapper(ResponseCampusUserDto)
  @BaseResponses()
  @BaseBodyResponses()
  @ApiOkResponse({ description: 'Currently logged in campus user updated successfully', type: ResponseCampusUserDto })
  async update(
    @User('id') id: string,
    @Body() updateLoggedInCampusUserDto: UpdateLoggedInCampusUserDto,
    @User() user: UserIdentity,
  ) {
    return this.campusUsersService.update(id, updateLoggedInCampusUserDto, undefined, user);
  }

  @Patch()
  @Auth(UserRole.CAMPUS)
  @Mapper(ResponseCampusUserDto)
  @BaseResponses()
  @BaseBodyResponses()
  @ApiOkResponse({
    description: 'Currently logged in campus user partially updated successfully',
    type: ResponseCampusUserDto,
  })
  async partialUpdate(
    @User('id') id: string,
    @Body() partialUpdateLoggedInCampusUserDto: PartialUpdateLoggedInCampusUserDto,
    @User() user: UserIdentity,
  ) {
    return this.campusUsersService.update(id, partialUpdateLoggedInCampusUserDto, undefined, user);
  }
}
