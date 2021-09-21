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
import { CrudService } from 'src/common/interfaces/crud-service.interface';
import { UserIdentity } from 'src/common/interfaces/user-identity.interface';
import { ProxyCrudService } from 'src/common/services/proxy-crud.service';
import { User as UserEntity } from 'src/users/users/entities/user.entity';
import { UsersService } from 'src/users/users/users.service';
import { Connection } from 'typeorm';
import { ResponseUserDto } from '../../users/users/dtos/response-user.dto';
import { PartialUpdateLoggedInUserDto } from './dto/partial-update-logged-in-user.dto';
import { UpdateLoggedInUserDto } from './dto/update-logged-in-user.dto';

@ApiTags(Collection.USER)
@Controller()
export class UserController {
  private readonly usersService: CrudService<UserEntity>;

  constructor(@InjectConnection() connection: Connection, usersService: UsersService) {
    this.usersService = new ProxyCrudService(connection, usersService);
  }

  @Get()
  @Auth(...ALL_ROLES)
  @Mapper(ResponseUserDto)
  @BaseResponses()
  @ApiOkResponse({ description: 'Currently logged in user', type: ResponseUserDto })
  async findOne(@User('id') id: string) {
    return this.usersService.findOne(id, undefined);
  }

  @Put()
  @Auth(...ALL_ROLES)
  @Mapper(ResponseUserDto)
  @BaseResponses()
  @BaseBodyResponses()
  @ApiOkResponse({ description: 'Currently logged in user updated successfully', type: ResponseUserDto })
  async update(@User('id') id: string, @Body() updateLoggedInUserDto: UpdateLoggedInUserDto, @User() user: UserIdentity) {
    return this.usersService.update(id, updateLoggedInUserDto, undefined, user);
  }

  @Patch()
  @Auth(...ALL_ROLES)
  @Mapper(ResponseUserDto)
  @BaseResponses()
  @BaseBodyResponses()
  @ApiOkResponse({ description: 'Currently logged in user partially updated successfully', type: ResponseUserDto })
  async partialUpdate(
    @User('id') id: string,
    @Body() partialUpdateLoggedInUserDto: PartialUpdateLoggedInUserDto,
    @User() user: UserIdentity
  ) {
    return this.usersService.update(id, partialUpdateLoggedInUserDto, undefined, user);
  }
}
