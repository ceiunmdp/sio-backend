import { Body, Controller } from '@nestjs/common';
import { ApiConflictResponse, ApiTags } from '@nestjs/swagger';
import { InjectConnection } from '@nestjs/typeorm';
import { CustomError } from 'src/common/classes/custom-error.class';
import { Group } from 'src/common/classes/group.class';
import { ProxyTypeOrmCrudService } from 'src/common/classes/proxy-typeorm-crud.service';
import { UUID_V4 } from 'src/common/constants/regular-expressions';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Id } from 'src/common/decorators/id.decorator';
import { GetAll } from 'src/common/decorators/methods/get-all.decorator';
import { GetById } from 'src/common/decorators/methods/get-by-id.decorator';
import { PatchById } from 'src/common/decorators/methods/patch-by-id.decorator';
import { PutById } from 'src/common/decorators/methods/put-by-id.decorator';
import { Limit, PageToken } from 'src/common/decorators/pagination.decorator';
import { Collection } from 'src/common/enums/collection.enum';
import { Path } from 'src/common/enums/path.enum';
import { TypeOrmCrudService } from 'src/common/interfaces/typeorm-crud-service.interface';
import { AppConfigService } from 'src/config/app/app-config.service';
import { Connection } from 'typeorm';
import { PartialUpdateUserDto } from './dtos/partial-update-user.dto';
import { ResponseUserDto } from './dtos/response-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller()
export class UsersController {
  private readonly usersService: TypeOrmCrudService<User>;

  constructor(
    @InjectConnection() connection: Connection,
    private readonly appConfigService: AppConfigService,
    usersService: UsersService,
  ) {
    this.usersService = new ProxyTypeOrmCrudService(connection, usersService);
  }

  @GetAll(Collection.USERS, ResponseUserDto)
  @Auth(Group.ADMIN)
  async findAll(@Limit() limit: number, @PageToken() pageToken: string) {
    return this.usersService.findAll({
      limit,
      pageToken,
      route: `${this.appConfigService.basePath}${Path.USERS}`,
    });
  }

  @GetById(Collection.USERS, ResponseUserDto, `:id(${UUID_V4})`)
  @Auth(Group.ADMIN)
  async findById(@Id() id: string) {
    return this.usersService.findById(id);
  }

  @PutById(Collection.USERS, ResponseUserDto, `:id(${UUID_V4})`)
  @Auth(Group.ADMIN)
  @ApiConflictResponse({ description: 'Email already assigned to another user', type: CustomError })
  async update(@Id() id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @PatchById(Collection.USERS, ResponseUserDto, `:id(${UUID_V4})`)
  @Auth(Group.ADMIN)
  @ApiConflictResponse({ description: 'Email already assigned to another user', type: CustomError })
  async partialUpdate(@Id() id: string, @Body() partialUpdateUserDto: PartialUpdateUserDto) {
    return this.usersService.update(id, partialUpdateUserDto);
  }
}
