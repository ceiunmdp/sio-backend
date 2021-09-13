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
  private readonly userService: CrudService<UserEntity>;

  constructor(@InjectConnection() connection: Connection, usersService: UsersService) {
    this.userService = new ProxyCrudService(connection, usersService);
  }

  @Get()
  @Auth(...ALL_ROLES)
  @Mapper(ResponseUserDto)
  @BaseResponses()
  @ApiOkResponse({ description: 'Currently logged in user', type: ResponseUserDto })
  async findOne(@User('id') id: string) {
    return this.userService.findOne(id, undefined);
  }

  @Put()
  @Auth(...ALL_ROLES)
  @Mapper(ResponseUserDto)
  @BaseResponses()
  @BaseBodyResponses()
  @ApiOkResponse({ description: 'Currently logged in user updated successfully', type: ResponseUserDto })
  async update(@User('id') id: string, @Body() updateLoggedInUserDto: UpdateLoggedInUserDto) {
    return this.userService.update(id, updateLoggedInUserDto, undefined);
  }

  @Patch()
  @Auth(...ALL_ROLES)
  @Mapper(ResponseUserDto)
  @BaseResponses()
  @BaseBodyResponses()
  @ApiOkResponse({ description: 'Currently logged in user partially updated successfully', type: ResponseUserDto })
  async partialUpdate(@User('id') id: string, @Body() partialUpdateLoggedInUserDto: PartialUpdateLoggedInUserDto) {
    return this.userService.update(id, partialUpdateLoggedInUserDto, undefined);
  }
}
