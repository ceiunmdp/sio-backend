import { Body, Controller, Get, Patch, Put } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { InjectConnection } from '@nestjs/typeorm';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Mapper } from 'src/common/decorators/mapper.decorator';
import { BaseBodyResponses } from 'src/common/decorators/methods/responses/base-body-responses.decorator';
import { BaseResponses } from 'src/common/decorators/methods/responses/base-responses.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { Collection } from 'src/common/enums/collection.enum';
import { IsolationLevel } from 'src/common/enums/isolation-level.enum';
import { UserRole } from 'src/common/enums/user-role.enum';
import { CampusUsersService } from 'src/users/campus-users/campus-users.service';
import { ResponseCampusUserDto } from 'src/users/campus-users/dtos/response-campus-user.dto';
import { Connection } from 'typeorm';
import { PartialUpdateLoggedInCampusUserDto } from './dto/partial-update-logged-in-campus-user.dto';
import { UpdateLoggedInCampusUserDto } from './dto/update-logged-in-campus-user.dto';

@ApiTags(Collection.CAMPUS_USER)
@Controller()
export class CampusUserController {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly campusUsersService: CampusUsersService,
  ) {}

  @Get()
  @Auth(UserRole.CAMPUS)
  @Mapper(ResponseCampusUserDto)
  @BaseResponses()
  @ApiOkResponse({ description: 'Currently logged in campus user', type: ResponseCampusUserDto })
  async findOne(@User('id') id: string) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager) => {
      return this.campusUsersService.findOne(id, manager);
    });
  }

  @Put()
  @Auth(UserRole.CAMPUS)
  @Mapper(ResponseCampusUserDto)
  @BaseResponses()
  @BaseBodyResponses()
  @ApiOkResponse({ description: 'Currently logged in campus user updated successfully', type: ResponseCampusUserDto })
  async update(@User('id') id: string, @Body() updateLoggedInCampusUserDto: UpdateLoggedInCampusUserDto) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager) => {
      return this.campusUsersService.update(id, updateLoggedInCampusUserDto, manager);
    });
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
  ) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager) => {
      return this.campusUsersService.update(id, partialUpdateLoggedInCampusUserDto, manager);
    });
  }
}
