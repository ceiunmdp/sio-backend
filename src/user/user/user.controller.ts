import { Body, Controller, Get, Patch, Put } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { InjectConnection } from '@nestjs/typeorm';
import { ALL_ROLES } from 'src/common/constants/all-roles.constant';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Mapper } from 'src/common/decorators/mapper.decorator';
import { BaseBodyResponses } from 'src/common/decorators/methods/responses/base-body-responses.decorator';
import { BaseResponses } from 'src/common/decorators/methods/responses/base-responses.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { Collection } from 'src/common/enums/collection.enum';
import { IsolationLevel } from 'src/common/enums/isolation-level.enum';
import { Connection } from 'typeorm';
import { ResponseUserDto } from '../../users/users/dtos/response-user.dto';
import { PartialUpdateLoggedInUserDto } from './dto/partial-update-logged-in-user.dto';
import { UpdateLoggedInUserDto } from './dto/update-logged-in-user.dto';
import { UserService } from './user.service';

@ApiTags(Collection.USER)
@Controller()
export class UserController {
  constructor(@InjectConnection() private readonly connection: Connection, private readonly userService: UserService) {}

  @Get()
  @Auth(...ALL_ROLES)
  @Mapper(ResponseUserDto)
  @BaseResponses()
  @ApiOkResponse({ description: 'Currently logged in user', type: ResponseUserDto })
  async findOne(@User('id') id: string) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager) => {
      return this.userService.findOne(id, manager);
    });
  }

  @Put()
  @Auth(...ALL_ROLES)
  @Mapper(ResponseUserDto)
  @BaseResponses()
  @BaseBodyResponses()
  @ApiOkResponse({ description: 'Currently logged in user updated successfully', type: ResponseUserDto })
  async update(@User('id') id: string, @Body() updateLoggedInUserDto: UpdateLoggedInUserDto) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager) => {
      return this.userService.update(id, updateLoggedInUserDto, manager);
    });
  }

  @Patch()
  @Auth(...ALL_ROLES)
  @Mapper(ResponseUserDto)
  @BaseResponses()
  @BaseBodyResponses()
  @ApiOkResponse({ description: 'Currently logged in user partially updated successfully', type: ResponseUserDto })
  async partialUpdate(@User('id') id: string, @Body() partialUpdateLoggedInUserDto: PartialUpdateLoggedInUserDto) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager) => {
      return this.userService.update(id, partialUpdateLoggedInUserDto, manager);
    });
  }
}
