import { Body, Controller } from '@nestjs/common';
import { ApiConflictResponse, ApiTags } from '@nestjs/swagger';
import { InjectConnection } from '@nestjs/typeorm';
import { CustomError } from 'src/common/classes/custom-error.class';
import { ID_AS_UUID_V4 } from 'src/common/constants/regular-expressions.constant';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Filter } from 'src/common/decorators/filter.decorator';
import { Id } from 'src/common/decorators/id.decorator';
import { GetAll } from 'src/common/decorators/methods/get-all.decorator';
import { GetById } from 'src/common/decorators/methods/get-by-id.decorator';
import { PatchById } from 'src/common/decorators/methods/patch-by-id.decorator';
import { PutById } from 'src/common/decorators/methods/put-by-id.decorator';
import { Limit, Page } from 'src/common/decorators/pagination.decorator';
import { Sort } from 'src/common/decorators/sort.decorator';
import { Collection } from 'src/common/enums/collection.enum';
import { Path } from 'src/common/enums/path.enum';
import { UserRole } from 'src/common/enums/user-role.enum';
import { CrudService } from 'src/common/interfaces/crud-service.interface';
import { Order } from 'src/common/interfaces/order.type';
import { Where } from 'src/common/interfaces/where.type';
import { ProxyCrudService } from 'src/common/services/proxy-crud.service';
import { AppConfigService } from 'src/config/app/app-config.service';
import { Connection } from 'typeorm';
import { PartialUpdateUserDto } from './dtos/partial-update-user.dto';
import { ResponseUserDto } from './dtos/response-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@ApiTags(Collection.USERS)
@Controller()
export class UsersController {
  private readonly usersService: CrudService<User>;

  constructor(
    @InjectConnection() connection: Connection,
    private readonly appConfigService: AppConfigService,
    usersService: UsersService,
  ) {
    this.usersService = new ProxyCrudService(connection, usersService);
  }

  @GetAll(Collection.USERS, ResponseUserDto)
  @Auth(UserRole.ADMIN)
  async findAll(@Limit() limit: number, @Page() page: number, @Filter() where: Where, @Sort() order: Order<User>) {
    return this.usersService.findAll(
      {
        limit,
        page,
        route: `${this.appConfigService.basePath}${Path.USERS}`,
      },
      where,
      order,
    );
  }

  @GetById(Collection.USERS, ResponseUserDto, ID_AS_UUID_V4)
  @Auth(UserRole.ADMIN)
  async findOne(@Id() id: string) {
    return this.usersService.findOne(id);
  }

  @PutById(Collection.USERS, ResponseUserDto, ID_AS_UUID_V4)
  @Auth(UserRole.ADMIN)
  @ApiConflictResponse({ description: 'Email already assigned to another user', type: CustomError })
  async update(@Id() id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @PatchById(Collection.USERS, ResponseUserDto, ID_AS_UUID_V4)
  @Auth(UserRole.ADMIN)
  @ApiConflictResponse({ description: 'Email already assigned to another user', type: CustomError })
  async partialUpdate(@Id() id: string, @Body() partialUpdateUserDto: PartialUpdateUserDto) {
    return this.usersService.update(id, partialUpdateUserDto);
  }
}
