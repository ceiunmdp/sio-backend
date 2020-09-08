import { Body, Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectConnection } from '@nestjs/typeorm';
import { Group } from 'src/common/classes/group.class';
import { ProxyCrudService } from 'src/common/classes/proxy-crud.service';
import { UUID_V4 } from 'src/common/constants/regular-expressions';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Id } from 'src/common/decorators/id.decorator';
import { GetAll } from 'src/common/decorators/methods/get-all.decorator';
import { GetById } from 'src/common/decorators/methods/get-by-id.decorator';
import { PatchById } from 'src/common/decorators/methods/patch-by-id.decorator';
import { Limit, Page } from 'src/common/decorators/pagination.decorator';
import { Collection } from 'src/common/enums/collection.enum';
import { Path } from 'src/common/enums/path.enum';
import { CrudService } from 'src/common/interfaces/crud-service.interface';
import { AppConfigService } from 'src/config/app/app-config.service';
import { Connection } from 'typeorm';
import { PartialUpdateItemDto } from './dtos/partial-update-item.dto';
import { ResponseItemDto } from './dtos/response-item.dto';
import { Item } from './entities/item.entity';
import { ItemsService } from './items.service';

@ApiTags('Items')
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
  @Auth(Group.ADMIN, Group.STUDENT, Group.SCHOLARSHIP)
  async findAll(@Limit() limit: number, @Page() page: number) {
    return this.itemsService.findAll({
      limit,
      page,
      route: `${this.appConfigService.basePath}${Path.ITEMS}`,
    });
  }

  @GetById(Collection.ITEMS, ResponseItemDto, `:id(${UUID_V4})`)
  @Auth(Group.ADMIN, Group.STUDENT, Group.SCHOLARSHIP)
  async findById(@Id() id: string) {
    return this.itemsService.findById(id);
  }

  @PatchById(Collection.ITEMS, ResponseItemDto, `:id(${UUID_V4})`)
  @Auth(Group.ADMIN)
  async partialUpdate(@Id() id: string, @Body() partialUpdateItemDto: PartialUpdateItemDto) {
    return this.itemsService.update(id, partialUpdateItemDto);
  }
}
