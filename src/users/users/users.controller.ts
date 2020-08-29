import { Body, Controller, Get, Patch, Put } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { InjectConnection } from '@nestjs/typeorm';
import { UUID_V4 } from 'src/common/constants/regular-expressions';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Id } from 'src/common/decorators/id.decorator';
import { Mapper } from 'src/common/decorators/mapper.decorator';
import { Limit, PageToken } from 'src/common/decorators/pagination.decorator';
import { Path } from 'src/common/enums/path.enum';
import { UserRole } from 'src/common/enums/user-role.enum';
import { AppConfigService } from 'src/config/app/app-config.service';
import { Connection, EntityManager } from 'typeorm';
import { IsolationLevel } from 'typeorm-transactional-cls-hooked';
import { PartialUpdateUserDto } from './dto/partial-update-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller()
export class UsersController {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly appConfigService: AppConfigService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  @Auth(UserRole.ADMIN)
  @Mapper(ResponseUserDto)
  @ApiOkResponse({ description: 'List of users.', type: ResponseUserDto })
  async findAll(@Limit() limit: number, @PageToken() pageToken: string) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager: EntityManager) => {
      return this.usersService.findAll(
        {
          limit,
          pageToken,
          route: `${this.appConfigService.basePath}${Path.USERS}`,
        },
        manager,
      );
    });
  }

  @Get(`:id(${UUID_V4})`)
  @Auth(UserRole.ADMIN)
  @Mapper(ResponseUserDto)
  @ApiOkResponse({ description: 'User', type: ResponseUserDto })
  async findById(@Id() id: string) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager: EntityManager) => {
      return this.usersService.findById(id, manager);
    });
  }

  @Put(`:id(${UUID_V4})`)
  @Auth(UserRole.ADMIN)
  @Mapper(ResponseUserDto)
  @ApiOkResponse({ description: 'The user has been successfully updated.', type: ResponseUserDto })
  async update(@Id() id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager: EntityManager) => {
      return this.usersService.update(id, updateUserDto, manager);
    });
  }

  @Patch(`:id(${UUID_V4})`)
  @Auth(UserRole.ADMIN)
  @Mapper(ResponseUserDto)
  @ApiOkResponse({
    description: 'The user has been successfully partially updated.',
    type: ResponseUserDto,
  })
  async partialUpdate(@Id() id: string, @Body() partialUpdateUserDto: PartialUpdateUserDto) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager: EntityManager) => {
      return this.usersService.update(id, partialUpdateUserDto, manager);
    });
  }
}
