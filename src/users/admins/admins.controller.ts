import { Body, Controller } from '@nestjs/common';
import { ApiConflictResponse, ApiTags } from '@nestjs/swagger';
import { InjectConnection } from '@nestjs/typeorm';
import { CustomError } from 'src/common/classes/custom-error.class';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Filter } from 'src/common/decorators/filter.decorator';
import { Id } from 'src/common/decorators/id.decorator';
import { DeleteById } from 'src/common/decorators/methods/delete-by-id.decorator';
import { GetAll } from 'src/common/decorators/methods/get-all.decorator';
import { GetById } from 'src/common/decorators/methods/get-by-id.decorator';
import { PatchById } from 'src/common/decorators/methods/patch-by-id.decorator';
import { PostAll } from 'src/common/decorators/methods/post-all.decorator';
import { PutById } from 'src/common/decorators/methods/put-by-id.decorator';
import { Limit, Page } from 'src/common/decorators/pagination.decorator';
import { Sort } from 'src/common/decorators/sort.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { Collection } from 'src/common/enums/collection.enum';
import { Path } from 'src/common/enums/path.enum';
import { UserRole } from 'src/common/enums/user-role.enum';
import { CrudService } from 'src/common/interfaces/crud-service.interface';
import { Order } from 'src/common/interfaces/order.type';
import { UserIdentity } from 'src/common/interfaces/user-identity.interface';
import { Where } from 'src/common/interfaces/where.type';
import { ProxyCrudService } from 'src/common/services/proxy-crud.service';
import { AppConfigService } from 'src/config/app/app-config.service';
import { Connection } from 'typeorm';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dtos/create-admin.dto';
import { PartialUpdateAdminDto } from './dtos/partial-update-admin.dto';
import { ResponseAdminDto } from './dtos/response-admin.dto';
import { UpdateAdminDto } from './dtos/update-admin.dto';
import { Admin } from './entities/admin.entity';

@ApiTags('Admins')
@Controller()
export class AdminsController {
  private readonly adminsService: CrudService<Admin>;

  constructor(
    @InjectConnection() connection: Connection,
    adminsService: AdminsService,
    private readonly appConfigService: AppConfigService,
  ) {
    this.adminsService = new ProxyCrudService(connection, adminsService);
  }

  @GetAll(Collection.ADMINS, ResponseAdminDto)
  @Auth(UserRole.ADMIN)
  async findAll(@Limit() limit: number, @Page() page: number, @Filter() where: Where, @Sort() order: Order<Admin>) {
    return this.adminsService.findAll(
      {
        limit,
        page,
        route: `${this.appConfigService.basePath}${Path.USERS}${Path.ADMINS}`,
      },
      where,
      order,
    );
  }

  @GetById(Collection.ADMINS, ResponseAdminDto)
  @Auth(UserRole.ADMIN)
  async findOne(@Id() id: string, @User() user: UserIdentity) {
    return this.adminsService.findOne(id, undefined, user);
  }

  @PostAll(Collection.ADMINS, ResponseAdminDto)
  @Auth(UserRole.ADMIN)
  @ApiConflictResponse({ description: 'Email already assigned to another user', type: CustomError })
  async create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminsService.create(createAdminDto);
  }

  @PutById(Collection.ADMINS, ResponseAdminDto)
  @Auth(UserRole.ADMIN)
  @ApiConflictResponse({ description: 'Email already assigned to another user', type: CustomError })
  async update(@Id() id: string, @Body() updateAdminDto: UpdateAdminDto, @User() user: UserIdentity) {
    return this.adminsService.update(id, updateAdminDto, undefined, user);
  }

  @PatchById(Collection.ADMINS, ResponseAdminDto)
  @Auth(UserRole.ADMIN)
  @ApiConflictResponse({ description: 'Email already assigned to another user', type: CustomError })
  async partialUpdate(
    @Id() id: string,
    @Body() partialUpdateAdminDto: PartialUpdateAdminDto,
    @User() user: UserIdentity,
  ) {
    return this.adminsService.update(id, partialUpdateAdminDto, undefined, user);
  }

  @DeleteById(Collection.ADMINS)
  @Auth(UserRole.ADMIN)
  async remove(@Id() id: string, @User() user: UserIdentity) {
    return this.adminsService.remove(id, { softRemove: false }, undefined, user);
  }
}
