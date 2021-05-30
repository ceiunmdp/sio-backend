import { Body, Controller, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
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
import { UserRole, UserRoleExpanded } from 'src/common/enums/user-role.enum';
import { CrudService } from 'src/common/interfaces/crud-service.interface';
import { Order } from 'src/common/interfaces/order.type';
import { UserIdentity } from 'src/common/interfaces/user-identity.interface';
import { Where } from 'src/common/interfaces/where.type';
import { ProxyCrudService } from 'src/common/services/proxy-crud.service';
import { AppConfigService } from 'src/config/app/app-config.service';
import { PrintersService } from 'src/printers/printers.service';
import { Connection } from 'typeorm';
import { Order as OrderEntity } from '../orders/entities/order.entity';
import { ResponseOrderFileDto } from './dtos/response/response-order-file.dto';
import { PartialUpdateOrderFileDto } from './dtos/update/partial-update-order-file.dto';
import { UpdateOrderFileDto } from './dtos/update/update-order-file.dto';
import { OrderFile } from './entities/order-file.entity';
import { EFileState } from './enums/e-file-state.enum';
import { OrderFilesService } from './order-files.service';

@ApiTags(Collection.ORDER_FILES)
@Controller()
export class OrderFilesController {
  private readonly orderFilesService: CrudService<OrderFile>;

  constructor(
    @InjectConnection() connection: Connection,
    private readonly appConfigService: AppConfigService,
    orderFilesService: OrderFilesService,
    private readonly printersService: PrintersService,
  ) {
    this.orderFilesService = new ProxyCrudService(connection, orderFilesService);
  }

  @GetAll(Collection.ORDER_FILES, ResponseOrderFileDto)
  @Auth(UserRole.ADMIN, UserRole.CAMPUS, ...UserRoleExpanded.STUDENT)
  async findAll(
    @ParentCollectionId('orderId', OrderEntity) orderId: string,
    @Limit() limit: number,
    @Page() page: number,
    @Filter() where: Where,
    @Sort() order: Order<OrderFile>,
    @User() user: UserIdentity,
  ) {
    return this.orderFilesService.findAll(
      {
        limit,
        page,
        route: `${this.appConfigService.basePath}${Path.ORDERS}/${orderId}${Path.ORDER_FILES}`,
      },
      where,
      order,
      undefined,
      user,
      { orderId },
    );
  }

  @GetById(Collection.ORDER_FILES, ResponseOrderFileDto)
  @Auth(UserRole.ADMIN, UserRole.CAMPUS, ...UserRoleExpanded.STUDENT)
  async findOne(
    @ParentCollectionId('orderId', OrderEntity) orderId: string,
    @Id() id: string,
    @User() user: UserIdentity,
  ) {
    return this.orderFilesService.findOne(id, undefined, user, { orderId });
  }

  @PutById(Collection.ORDER_FILES, ResponseOrderFileDto)
  @Auth(UserRole.ADMIN, UserRole.CAMPUS)
  async update(@Id() id: string, @Body() updateOrderFileDto: UpdateOrderFileDto, @User() user: UserIdentity) {
    this.checkParametersCombinationIsCorrect(updateOrderFileDto);
    return this.orderFilesService.update(id, updateOrderFileDto, undefined, user);
  }

  @PatchById(Collection.ORDER_FILES, ResponseOrderFileDto)
  @Auth(UserRole.ADMIN, UserRole.CAMPUS)
  async partialUpdate(
    @Id() id: string,
    @Body() partialUpdateOrderFileDto: PartialUpdateOrderFileDto,
    @User() user: UserIdentity,
  ) {
    this.checkParametersCombinationIsCorrect(partialUpdateOrderFileDto);
    return this.orderFilesService.update(id, partialUpdateOrderFileDto, undefined, user);
  }

  private checkParametersCombinationIsCorrect(updateOrderFileDto: PartialUpdateOrderFileDto) {
    if (updateOrderFileDto.printerId) {
      this.checkPrinterExists(updateOrderFileDto.printerId);
      if (updateOrderFileDto.state.code === EFileState.PRINTED) {
        throw new UnprocessableEntityException('printer_id is not required to update OrderFile to PRINTED state.');
      }
    } else if (updateOrderFileDto.state.code === EFileState.PRINTING) {
      throw new UnprocessableEntityException('printer_id is required to update OrderFile to PRINTING state.');
    }
  }

  private checkPrinterExists(printerId: string) {
    try {
      this.printersService.findOne(printerId);
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw new UnprocessableEntityException('printer_id provided does not correspond to any existing Printer.');
      } else {
        throw err;
      }
    }
  }
}
