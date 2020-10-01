import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { InjectConnection } from '@nestjs/typeorm';
import { ALL_ROLES } from 'src/common/constants/all-roles';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Mapper } from 'src/common/decorators/mapper.decorator';
import { BaseBodyResponses } from 'src/common/decorators/methods/responses/base-body-responses.decorator';
import { BaseResponses } from 'src/common/decorators/methods/responses/base-responses.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { IsolationLevel } from 'src/common/enums/isolation-level.enum';
import { Connection, EntityManager } from 'typeorm';
import { ResponseUserDto } from '../users/users/dtos/response-user.dto';
import { PartialUpdateLoggedInUserDto } from './dto/partial-update-logged-in-user.dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller()
export class UserController {
  constructor(@InjectConnection() private readonly connection: Connection, private readonly userService: UserService) {}

  @Get()
  @Auth(...ALL_ROLES)
  @Mapper(ResponseUserDto)
  @BaseResponses()
  @ApiOkResponse({ description: 'Currently logged in user', type: ResponseUserDto })
  async find(@User('id') id: string) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager: EntityManager) => {
      return this.userService.findOne(id, manager);
    });
  }

  @Patch()
  @Auth(...ALL_ROLES)
  @Mapper(ResponseUserDto)
  @BaseResponses()
  @BaseBodyResponses()
  @ApiOkResponse({ description: 'Currently user partially updated successfully', type: ResponseUserDto })
  async partialUpdate(@User('id') id: string, @Body() partialUpdateLoggedInUserDto: PartialUpdateLoggedInUserDto) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager: EntityManager) => {
      return this.userService.update(id, partialUpdateLoggedInUserDto, manager);
    });
  }
}
