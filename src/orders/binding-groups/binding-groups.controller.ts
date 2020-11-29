import { Body, Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectConnection } from '@nestjs/typeorm';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Filter } from 'src/common/decorators/filter.decorator';
import { Id } from 'src/common/decorators/id.decorator';
import { GetAll } from 'src/common/decorators/methods/get-all.decorator';
import { GetById } from 'src/common/decorators/methods/get-by-id.decorator';
import { PatchById } from 'src/common/decorators/methods/patch-by-id.decorator';
import { PutById } from 'src/common/decorators/methods/put-by-id.decorator';
import { Limit, Page } from 'src/common/decorators/pagination.decorator';
import { ParentCollectionId } from 'src/common/decorators/parent-collection-id.decorator';
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
import { Order as OrderEntity } from '../orders/entities/order.entity';
import { BindingGroupsService } from './binding-groups.service';
import { PartialUpdateBindingGroupDto } from './dtos/partial-update-binding-group.dto';
import { ResponseBindingGroupDto } from './dtos/response-binding-group.dto';
import { UpdateBindingGroupDto } from './dtos/update-binding-group.dto';
import { BindingGroup } from './entities/binding-group.entity';

@ApiTags(Collection.BINDING_GROUPS)
@Controller()
export class BindingGroupsController {
  private readonly bindingGroupsService: CrudService<BindingGroup>;

  constructor(
    @InjectConnection() connection: Connection,
    private readonly appConfigService: AppConfigService,
    bindingGroupsService: BindingGroupsService,
  ) {
    this.bindingGroupsService = new ProxyCrudService(connection, bindingGroupsService);
  }

  @GetAll(Collection.BINDING_GROUPS, ResponseBindingGroupDto)
  @Auth(UserRole.ADMIN, UserRole.CAMPUS, UserRole.STUDENT, UserRole.SCHOLARSHIP)
  async findAll(
    @ParentCollectionId('orderId', OrderEntity) orderId: string,
    @Limit() limit: number,
    @Page() page: number,
    @Filter() where: Where,
    @Sort() order: Order<BindingGroup>,
    @User() user: UserIdentity,
  ) {
    return this.bindingGroupsService.findAll(
      {
        limit,
        page,
        route: `${this.appConfigService.basePath}${Path.ORDERS}/${orderId}${Path.BINDING_GROUPS}`,
      },
      where,
      order,
      undefined,
      user,
      { orderId },
    );
  }

  // TODO: /binding-groups/:id OR /orders/:orderId/binding-groups/:id ?
  // TODO: If we decide for the first option, a new controller would be necessary
  @GetById(Collection.BINDING_GROUPS, ResponseBindingGroupDto)
  @Auth(UserRole.ADMIN, UserRole.CAMPUS, UserRole.STUDENT, UserRole.SCHOLARSHIP)
  async findOne(
    @ParentCollectionId('orderId', OrderEntity) orderId: string,
    @Id() id: string,
    @User() user: UserIdentity,
  ) {
    return this.bindingGroupsService.findOne(id, undefined, user, { orderId });
  }

  @PutById(Collection.BINDING_GROUPS, ResponseBindingGroupDto)
  @Auth(UserRole.ADMIN, UserRole.CAMPUS)
  async update(@Id() id: string, @Body() updateBindingGroupDto: UpdateBindingGroupDto, @User() user: UserIdentity) {
    return this.bindingGroupsService.update(id, updateBindingGroupDto, undefined, user);
  }

  @PatchById(Collection.BINDING_GROUPS, ResponseBindingGroupDto)
  @Auth(UserRole.ADMIN, UserRole.CAMPUS)
  async partialUpdate(
    @Id() id: string,
    @Body() partialUpdateBindingGroupDto: PartialUpdateBindingGroupDto,
    @User() user: UserIdentity,
  ) {
    return this.bindingGroupsService.update(id, partialUpdateBindingGroupDto, undefined, user);
  }
}
