import { Body, Controller } from '@nestjs/common';
import { ApiConflictResponse, ApiTags } from '@nestjs/swagger';
import { InjectConnection } from '@nestjs/typeorm';
import { CustomError } from 'src/common/classes/custom-error.class';
import { UUID_V4 } from 'src/common/constants/regular-expressions';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Filter } from 'src/common/decorators/filter.decorator';
import { Id } from 'src/common/decorators/id.decorator';
import { GetAll } from 'src/common/decorators/methods/get-all.decorator';
import { GetById } from 'src/common/decorators/methods/get-by-id.decorator';
import { PatchById } from 'src/common/decorators/methods/patch-by-id.decorator';
import { PutById } from 'src/common/decorators/methods/put-by-id.decorator';
import { Limit, PageToken } from 'src/common/decorators/pagination.decorator';
import { Sort } from 'src/common/decorators/sort.decorator';
import { Collection } from 'src/common/enums/collection.enum';
import { Path } from 'src/common/enums/path.enum';
import { UserRole } from 'src/common/enums/user-role.enum';
import { Order } from 'src/common/interfaces/order.type';
import { TypeOrmCrudService } from 'src/common/interfaces/typeorm-crud-service.interface';
import { Where } from 'src/common/interfaces/where.type';
import { ProxyTypeOrmCrudService } from 'src/common/services/proxy-typeorm-crud.service';
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
  @Auth(UserRole.ADMIN)
  async findAll(
    @Limit() limit: number,
    @PageToken() pageToken: string,
    @Filter() where: Where,
    @Sort() order: Order<User>,
  ) {
    return this.usersService.findAll(
      {
        limit,
        pageToken,
        route: `${this.appConfigService.basePath}${Path.USERS}`,
      },
      where,
      order,
    );
  }

  @GetById(Collection.USERS, ResponseUserDto, `:id(${UUID_V4})`)
  @Auth(UserRole.ADMIN)
  async findById(@Id() id: string) {
    return this.usersService.findById(id);
  }

  @PutById(Collection.USERS, ResponseUserDto, `:id(${UUID_V4})`)
  @Auth(UserRole.ADMIN)
  @ApiConflictResponse({ description: 'Email already assigned to another user', type: CustomError })
  async update(@Id() id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @PatchById(Collection.USERS, ResponseUserDto, `:id(${UUID_V4})`)
  @Auth(UserRole.ADMIN)
  @ApiConflictResponse({ description: 'Email already assigned to another user', type: CustomError })
  async partialUpdate(@Id() id: string, @Body() partialUpdateUserDto: PartialUpdateUserDto) {
    return this.usersService.update(id, partialUpdateUserDto);
  }
}
