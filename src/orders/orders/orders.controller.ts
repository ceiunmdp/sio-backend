import { Body, Controller, UnprocessableEntityException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectConnection } from '@nestjs/typeorm';
import { flatten } from 'lodash';
import { multirange } from 'multi-integer-range';
import { PDFDocument } from 'pdf-lib';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Filter } from 'src/common/decorators/filter.decorator';
import { Id } from 'src/common/decorators/id.decorator';
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
import { UserRole, UserRoleExpanded } from 'src/common/enums/user-role.enum';
import { CrudService } from 'src/common/interfaces/crud-service.interface';
import { Order } from 'src/common/interfaces/order.type';
import { UserIdentity } from 'src/common/interfaces/user-identity.interface';
import { Where } from 'src/common/interfaces/where.type';
import { ProxyCrudService } from 'src/common/services/proxy-crud.service';
import { AppConfigService } from 'src/config/app/app-config.service';
import { FilesService } from 'src/files/files.service';
import { BindingsService } from 'src/items/bindings/bindings.service';
import { Connection, EntityManager } from 'typeorm';
import { CreateBindingGroupDto } from '../binding-groups/dtos/create-binding-group.dto';
import { CreateOrderFileDto } from '../order-files/dtos/create/create-order-file.dto';
import { CreateOrderDto } from './dtos/create/create-order.dto';
import { ResponseOrderDto } from './dtos/response/response-order.dto';
import { PartialUpdateOrderDto } from './dtos/update/partial-update-order.dto';
import { UpdateOrderDto } from './dtos/update/update-order.dto';
import { Order as OrderEntity } from './entities/order.entity';
import { OrdersService } from './orders.service';
import { calculateNumberOfSheets } from './utils/calculate-number-of-sheets';

@ApiTags(Collection.ORDERS)
@Controller()
export class OrdersController {
  private readonly ordersService: CrudService<OrderEntity>;

  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly appConfigService: AppConfigService,
    private readonly filesService: FilesService,
    private readonly bindingsService: BindingsService,
    ordersService: OrdersService,
  ) {
    this.ordersService = new ProxyCrudService(connection, ordersService);
  }

  @GetAll(Collection.ORDERS, ResponseOrderDto)
  @Auth(UserRole.ADMIN, UserRole.CAMPUS)
  async findAll(
    @Limit() limit: number,
    @Page() page: number,
    @Filter() where: Where,
    @Sort() order: Order<OrderEntity>,
  ) {
    return this.ordersService.findAll(
      {
        limit,
        page,
        route: `${this.appConfigService.basePath}${Path.ORDERS}`,
      },
      where,
      order,
    );
  }

  @GetAll(Collection.ORDERS, ResponseOrderDto, Path.ME)
  @Auth(UserRole.ADMIN, UserRole.CAMPUS, ...UserRoleExpanded.STUDENT)
  async findAllOwn(
    @Limit() limit: number,
    @Page() page: number,
    @Filter() where: Where,
    @Sort() order: Order<OrderEntity>,
    @User() user: UserIdentity,
  ) {
    return this.ordersService.findAll(
      {
        limit,
        page,
        route: `${this.appConfigService.basePath}${Path.ORDERS}`,
      },
      where,
      order,
      undefined,
      user,
    );
  }

  @GetById(Collection.ORDERS, ResponseOrderDto)
  @Auth(UserRole.ADMIN, UserRole.CAMPUS, ...UserRoleExpanded.STUDENT)
  async findOne(@Id() id: string, @User() user: UserIdentity) {
    return this.ordersService.findOne(id, undefined, user);
  }

  @PostAll(Collection.ORDERS, ResponseOrderDto)
  @Auth(...UserRoleExpanded.STUDENT)
  async create(@Body() createOrderDto: CreateOrderDto, @User() user: UserIdentity) {
    return this.connection.transaction(async (manager) => {
      await this.validateDto(createOrderDto.orderFiles, manager);
      return this.ordersService.create(createOrderDto, manager, user);
    });
  }

  private async validateDto(orderFiles: CreateOrderFileDto[], manager: EntityManager) {
    await this.validateFilesOfEachOrderFile(orderFiles, manager);
    this.validateBindingGroupsAndPositions(orderFiles);
    await this.validateRangeOfEachConfiguration(orderFiles);
    await this.validateSizeOfEachBindingGroup(orderFiles, manager);
  }

  private async validateFilesOfEachOrderFile(orderFiles: CreateOrderFileDto[], manager: EntityManager) {
    for (const orderFile of orderFiles) {
      if (orderFile.encodedFile) {
        if (orderFile.fileId) {
          throw new UnprocessableEntityException(
            'Cannot place an order referencing a valid file and also providing a base64 string.',
          );
        } else {
          const buffer = await PDFDocument.load(orderFile.encodedFile.content);
          if (buffer) {
            orderFile.pdfDocument = buffer;
          } else {
            throw new UnprocessableEntityException('Base64 string does not correspond to a valid pdf file.');
          }
        }
      } else {
        if (!orderFile.fileId) {
          throw new UnprocessableEntityException('File id or base64 string not provided.');
        } else {
          orderFile.file = await this.filesService.findOne(orderFile.fileId, manager);
        }
      }
    }
  }

  private validateBindingGroupsAndPositions(orderFiles: CreateOrderFileDto[]) {
    orderFiles.forEach((orderFile) => {
      if (orderFile.copies < orderFile.bindingGroups?.length) {
        throw new UnprocessableEntityException(
          'Number of copies does not agree with number of binding groups in orderFile.',
        );
      }
    });

    const groupsMap = this.buildBindingGroupsMapWithPositions(
      flatten(orderFiles.flatMap((orderFile) => orderFile.bindingGroups || [])),
    );
    this.validateGroupsAndPositions(groupsMap);
  }

  private buildBindingGroupsMapWithPositions(bindingGroups: CreateBindingGroupDto[]) {
    const bindingGroupsMap = new Map<number, Set<number>>();

    bindingGroups.map(({ id, position }) => {
      if (bindingGroupsMap.has(id)) {
        bindingGroupsMap.get(id).add(position);
      } else {
        bindingGroupsMap.set(id, new Set([position]));
      }
    });

    return bindingGroupsMap;
  }

  private validateGroupsAndPositions(groupsMap: Map<number, Set<number>>) {
    const arrayBindingGroups = Array.from(groupsMap.keys()).sort();

    if (arrayBindingGroups.length) {
      if (!this.arrayStartsWithOne(arrayBindingGroups)) {
        throw new UnprocessableEntityException(`Binding groups must start from number 1.`);
      } else if (!this.arrayHasAllConsecutiveValues(arrayBindingGroups)) {
        throw new UnprocessableEntityException('Binding groups wrongly created, must have all consecutive names.');
      } else {
        groupsMap.forEach((positions, bindingGroup) => {
          const arrayPositions = Array.from(positions).sort();

          if (!this.arrayStartsWithOne(arrayPositions)) {
            throw new UnprocessableEntityException(
              `Binding group N° ${bindingGroup} does not have any file starting on the first position.`,
            );
          } else if (!this.arrayHasAllConsecutiveValues(arrayPositions)) {
            throw new UnprocessableEntityException(
              `Positions array from binding group N° ${bindingGroup} wrongly created, must have all consecutive numbers.`,
            );
          }
        });
      }
    }
  }

  private arrayStartsWithOne(array: number[]) {
    return array[0] === 1;
  }

  private arrayHasAllConsecutiveValues(array: number[]) {
    return array.every((num, i) => i === array.length - 1 || num + 1 === array[i + 1]);
  }

  private async validateRangeOfEachConfiguration(orderFiles: CreateOrderFileDto[]) {
    for (const orderFile of orderFiles) {
      const { doubleSided, range, slidesPerSheet } = orderFile.configuration;
      const multiRange = multirange(range);
      const numberOfSheets = orderFile.fileId ? orderFile.file.numberOfSheets : orderFile.pdfDocument.getPageCount();

      if (multiRange.max() > numberOfSheets) {
        throw new UnprocessableEntityException(`Range ${range} does not agree with file's number of sheets`);
      } else {
        orderFile.configuration.range = multiRange.toString();
        orderFile.configuration.numberOfSheets = calculateNumberOfSheets(
          multiRange.length(),
          doubleSided,
          slidesPerSheet,
        );
      }
    }
  }

  private async validateSizeOfEachBindingGroup(orderFiles: CreateOrderFileDto[], manager: EntityManager) {
    const bindingGroupsMap = this.buildBindingGroupsMapWithFilesNumberOfSheets(orderFiles);
    const maximumNumberOfSheetsAllowed = await this.bindingsService.findBiggerSheetsLimit(manager);

    bindingGroupsMap.forEach((totalNumberOfSheets, bindingGroup) => {
      if (totalNumberOfSheets > maximumNumberOfSheetsAllowed) {
        throw new UnprocessableEntityException(
          `Binding group N° ${bindingGroup} exceeds maximum number of sheets allowed in any binding group in the system.`,
        );
      }
    });
  }

  private buildBindingGroupsMapWithFilesNumberOfSheets(orderFiles: CreateOrderFileDto[]) {
    const bindingGroupsMap = new Map<number, number>();

    for (const orderFile of orderFiles) {
      if (orderFile.bindingGroups) {
        const calculatedNumberOfSheets = orderFile.configuration.numberOfSheets;
        orderFile.bindingGroups.forEach(({ id }) => {
          if (bindingGroupsMap.has(id)) {
            bindingGroupsMap.set(id, bindingGroupsMap.get(id) + calculatedNumberOfSheets);
          } else {
            bindingGroupsMap.set(id, calculatedNumberOfSheets);
          }
        });
      }
    }

    return bindingGroupsMap;
  }

  @PutById(Collection.ORDERS, ResponseOrderDto)
  @Auth(UserRole.ADMIN, UserRole.CAMPUS, ...UserRoleExpanded.STUDENT)
  async update(@Id() id: string, @Body() updateOrderDto: UpdateOrderDto, @User() user: UserIdentity) {
    return this.ordersService.update(id, updateOrderDto, undefined, user);
  }

  @PatchById(Collection.ORDERS, ResponseOrderDto)
  @Auth(UserRole.ADMIN, UserRole.CAMPUS, ...UserRoleExpanded.STUDENT)
  async partialUpdate(
    @Id() id: string,
    @Body() partialUpdateOrderDto: PartialUpdateOrderDto,
    @User() user: UserIdentity,
  ) {
    return this.ordersService.update(id, partialUpdateOrderDto, undefined, user);
  }
}
