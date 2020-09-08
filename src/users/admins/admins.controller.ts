import { BadRequestException, Body, Controller } from '@nestjs/common';
import { ApiConflictResponse, ApiTags } from '@nestjs/swagger';
import { InjectConnection } from '@nestjs/typeorm';
import { CustomError } from 'src/common/classes/custom-error.class';
import { Group } from 'src/common/classes/group.class';
import { ProxyTypeOrmCrudService } from 'src/common/classes/proxy-typeorm-crud.service';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Id } from 'src/common/decorators/id.decorator';
import { DeleteById } from 'src/common/decorators/methods/delete-by-id.decorator';
import { GetAll } from 'src/common/decorators/methods/get-all.decorator';
import { GetById } from 'src/common/decorators/methods/get-by-id.decorator';
import { PatchById } from 'src/common/decorators/methods/patch-by-id.decorator';
import { PostAll } from 'src/common/decorators/methods/post-all.decorator';
import { PutById } from 'src/common/decorators/methods/put-by-id.decorator';
import { Limit, Page } from 'src/common/decorators/pagination.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { Collection } from 'src/common/enums/collection.enum';
import { Path } from 'src/common/enums/path.enum';
import { TypeOrmCrudService } from 'src/common/interfaces/typeorm-crud-service.interface';
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
  private readonly adminsService: TypeOrmCrudService<Admin>;

  constructor(
    @InjectConnection() connection: Connection,
    adminsService: AdminsService,
    private readonly appConfigService: AppConfigService,
  ) {
    this.adminsService = new ProxyTypeOrmCrudService(connection, adminsService);
  }

  @GetAll(Collection.ADMINS, ResponseAdminDto)
  @Auth(Group.ADMIN)
  async findAll(@Limit() limit: number, @Page() page: number) {
    return this.adminsService.findAll({
      limit,
      page,
      route: `${this.appConfigService.basePath}${Path.USERS}${Path.ADMINS}`,
    });
  }

  @GetById(Collection.ADMINS, ResponseAdminDto)
  @Auth(Group.ADMIN)
  async findById(@Id() id: string) {
    return this.adminsService.findById(id);
  }

  @PostAll(Collection.ADMINS, ResponseAdminDto)
  @Auth(Group.ADMIN)
  @ApiConflictResponse({ description: 'Email already assigned to another user', type: CustomError })
  async create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminsService.create(createAdminDto);
  }

  @PutById(Collection.ADMINS, ResponseAdminDto)
  @Auth(Group.ADMIN)
  @ApiConflictResponse({ description: 'Email already assigned to another user', type: CustomError })
  async update(@Id() id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminsService.update(id, updateAdminDto);
  }

  @PatchById(Collection.ADMINS, ResponseAdminDto)
  @Auth(Group.ADMIN)
  @ApiConflictResponse({ description: 'Email already assigned to another user', type: CustomError })
  async partialUpdate(@Id() id: string, @Body() partialUpdateAdminDto: PartialUpdateAdminDto) {
    return this.adminsService.update(id, partialUpdateAdminDto);
  }

  @DeleteById(Collection.ADMINS)
  @Auth(Group.ADMIN)
  async delete(@User('id') userId: string, @Id() id: string) {
    if (userId !== id) {
      return this.adminsService.delete(id);
    } else {
      throw new BadRequestException('No es posible eliminarse a sí mismo como administrador.');
    }
  }
}
