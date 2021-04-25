import { Body, Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectConnection } from '@nestjs/typeorm';
import { ID_AS_UUID_V4 } from 'src/common/constants/regular-expressions.constant';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Filter } from 'src/common/decorators/filter.decorator';
import { Id } from 'src/common/decorators/id.decorator';
import { GetAll } from 'src/common/decorators/methods/get-all.decorator';
import { GetById } from 'src/common/decorators/methods/get-by-id.decorator';
import { PatchById } from 'src/common/decorators/methods/patch-by-id.decorator';
import { Limit, Page } from 'src/common/decorators/pagination.decorator';
import { Sort } from 'src/common/decorators/sort.decorator';
import { Collection } from 'src/common/enums/collection.enum';
import { Path } from 'src/common/enums/path.enum';
import { UserRole, UserRoleExpanded } from 'src/common/enums/user-role.enum';
import { CrudService } from 'src/common/interfaces/crud-service.interface';
import { Order } from 'src/common/interfaces/order.type';
import { Where } from 'src/common/interfaces/where.type';
import { ProxyCrudService } from 'src/common/services/proxy-crud.service';
import { AppConfigService } from 'src/config/app/app-config.service';
import { Connection } from 'typeorm';
import { PartialUpdateItemDto } from './dtos/partial-update-item.dto';
import { ResponseItemDto } from './dtos/response-item.dto';
import { Item } from './entities/item.entity';
import { ItemsService } from './items.service';

@ApiTags(Collection.ITEMS)
@Controller()
export class ItemsController {
  private readonly itemsService: CrudService<Item>;

  constructor(
    @InjectConnection() connection: Connection,
    itemsService: ItemsService,
    private readonly appConfigService: AppConfigService,
  ) {
    this.itemsService = new ProxyCrudService(connection, itemsService);
  }

  @GetAll(Collection.ITEMS, ResponseItemDto)
  @Auth(UserRole.ADMIN, ...UserRoleExpanded.STUDENT)
  async findAll(@Limit() limit: number, @Page() page: number, @Filter() where: Where, @Sort() order: Order<Item>) {
    return this.itemsService.findAll(
      {
        limit,
        page,
        route: `${this.appConfigService.basePath}${Path.ITEMS}`,
      },
      where,
      order,
    );
  }

  @GetById(Collection.ITEMS, ResponseItemDto, ID_AS_UUID_V4)
  @Auth(UserRole.ADMIN, ...UserRoleExpanded.STUDENT)
  async findOne(@Id() id: string) {
    return this.itemsService.findOne(id);
  }

  @PatchById(Collection.ITEMS, ResponseItemDto, ID_AS_UUID_V4)
  @Auth(UserRole.ADMIN)
  async partialUpdate(@Id() id: string, @Body() partialUpdateItemDto: PartialUpdateItemDto) {
    return this.itemsService.update(id, partialUpdateItemDto);
  }
}
