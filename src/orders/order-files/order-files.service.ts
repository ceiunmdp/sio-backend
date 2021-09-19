import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { flatten } from 'lodash';
import { IsolationLevel } from 'src/common/enums/isolation-level.enum';
import { GenericInterface } from 'src/common/interfaces/generic.interface';
import { UserIdentity } from 'src/common/interfaces/user-identity.interface';
import { GenericCrudService } from 'src/common/services/generic-crud.service';
import { isStudentOrScholarship } from 'src/common/utils/is-role-functions';
import { AppConfigService } from 'src/config/app/app-config.service';
import { File } from 'src/files/entities/file.entity';
import { PrintersService } from 'src/printers/printers.service';
import { Connection, EntityManager, SelectQueryBuilder } from 'typeorm';
import { BindingGroup } from '../binding-groups/entities/binding-group.entity';
import { EBindingGroupState } from '../binding-groups/enums/e-binding-group-state.enum';
import { EOrderState } from '../orders/enums/e-order-state.enum';
import { OrdersGateway } from '../orders/orders.gateway';
import { OrdersService } from '../orders/orders.service';
import { isOrderFromStudent } from '../orders/utils/is-order-from-student';
import { CreateConfigurationDto } from './dtos/create/create-configuration.dto';
import { CreateOrderFileDto } from './dtos/create/create-order-file.dto';
import { PartialUpdateOrderFileDto } from './dtos/update/partial-update-order-file.dto';
import { Configuration } from './entities/configuration.entity';
import { FileState } from './entities/file-state.entity';
import { OrderFile } from './entities/order-file.entity';
import { EFileState } from './enums/e-file-state.enum';
import { Prices } from './interfaces/prices.interface';
import { OrderFilesRepository } from './order-files.repository';

@Injectable()
export class OrderFilesService extends GenericCrudService<OrderFile> implements OnModuleInit {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly appConfigService: AppConfigService,
    @Inject(forwardRef(() => OrdersService)) private readonly ordersService: OrdersService,
    private readonly ordersGateway: OrdersGateway,
    // private readonly orderFilesGateway: OrderFilesGateway,
    private readonly printersService: PrintersService,
  ) {
    super(OrderFile);
  }

  async onModuleInit() {
    if (!this.appConfigService.isProduction()) {
      await this.createFileStates(this.connection.manager);
    }
  }

  private async createFileStates(manager: EntityManager) {
    const fileStatesRepository = this.getFileStatesRepository(manager);

    if (!(await fileStatesRepository.count())) {
      return fileStatesRepository.save([
        new FileState({ name: 'Por imprimir', code: EFileState.TO_PRINT }),
        new FileState({ name: 'Imprimiendo', code: EFileState.PRINTING }),
        new FileState({ name: 'Impreso', code: EFileState.PRINTED }),
      ]);
    }
  }

  //* findAll
  // TODO: Throw exception when orderId does not belong to student
  protected addExtraClauses(
    queryBuilder: SelectQueryBuilder<OrderFile>,
    user: UserIdentity,
    parentCollectionIds: GenericInterface,
  ) {
    queryBuilder
      //* https://stackoverflow.com/questions/66117005/typeorm-left-joining-without-deletedat-is-null/66124903#66124903
      //* Include deleted tuples from base entity and all the joined ones (we aim to include the deleted files that make up the OrderFile)
      .withDeleted()
      .innerJoin(`${queryBuilder.alias}.order`, 'order')
      .andWhere('order.id = :orderId', { orderId: parentCollectionIds.orderId })
      .innerJoinAndSelect(`${queryBuilder.alias}.file`, 'file')
      .innerJoinAndSelect(`${queryBuilder.alias}.state`, 'state')
      .innerJoinAndSelect(`${queryBuilder.alias}.configuration`, 'configuration')
      .leftJoinAndSelect(`${queryBuilder.alias}.bindingGroup`, 'bindingGroup')
      .leftJoinAndSelect('bindingGroup.state', 'bindingGroupState')
      //* After all the joins have been made, exclude the OrderFiles that were deleted (not a possible scenario at the time of writing)
      .andWhere(`${queryBuilder.alias}.deletedAt IS NULL`)

    if (isStudentOrScholarship(user)) {
      queryBuilder.andWhere('order.student_id = :studentId', { studentId: user.id });
    }

    return queryBuilder;
  }

  async findOrderFilesByOrderId(id: string, manager: EntityManager) {
    return this.getOrderFilesRepository(manager).find({
      where: { order: { id } },
      relations: this.getFindOneRelations(),
      loadEagerRelations: true,
    });
  }

  async findOrderFilesByBindingGroupId(id: string, manager: EntityManager) {
    return this.getOrderFilesRepository(manager).find({
      where: { bindingGroup: { id } },
      relations: this.getFindOneRelations(),
      loadEagerRelations: true,
    });
  }

  //* findOne
  protected async checkFindOneConditions(orderFile: OrderFile, _manager: EntityManager, user: UserIdentity) {
    // TODO: Still remaining verify that orderFileId belongs to orderId (param)
    if (isStudentOrScholarship(user) && !isOrderFromStudent(user.id, orderFile.order)) {
      throw new ForbiddenException('Prohibido el acceso al recurso.');
    }
  }

  buildBindingGroupsMapWithNumberOfSheetsOfBG(orderFiles: CreateOrderFileDto[]) {
    const bindingGroupsMap = new Map<number, number>();

    orderFiles.forEach((orderFile) => {
      if (orderFile.bindingGroups) {
        orderFile.bindingGroups.forEach(({ id }) => {
          const numberOfSheets = orderFile.configuration.numberOfSheets;
          if (bindingGroupsMap.has(id)) {
            bindingGroupsMap.set(id, bindingGroupsMap.get(id) + numberOfSheets);
          } else {
            bindingGroupsMap.set(id, numberOfSheets);
          }
        });
      }
    });

    return bindingGroupsMap;
  }

  calculateOrderFilePrice({ copies, configuration }: CreateOrderFileDto, prices: Prices) {
    return copies * this.calculateConfigurationPrice(configuration, prices);
  }

  calculateConfigurationPrice({ colour, doubleSided, numberOfSheets }: CreateConfigurationDto, prices: Prices) {
    return (colour ? prices.colour : 1) * (doubleSided ? prices.doubleSided : prices.simpleSided) * numberOfSheets;
  }

  //! Implemented to avoid creation of order files by error by other developers
  async create(): Promise<OrderFile> {
    throw new Error('Method not implemented.');
  }

  async createOrderFiles(
    createOrderFiles: CreateOrderFileDto[],
    bindingGroupsMap: Map<number, BindingGroup>,
    toPrintState: FileState,
    manager: EntityManager,
  ) {
    const orderFiles: OrderFile[] = [];

    for (const orderFile of createOrderFiles) {
      orderFiles.push(...(await this.createOrderFile(orderFile, toPrintState, bindingGroupsMap, manager)));
    }

    return flatten(orderFiles);
  }

  private async createOrderFile(
    createOrderFile: CreateOrderFileDto,
    initialState: FileState,
    bindingGroupsMap: Map<number, BindingGroup>,
    manager: EntityManager,
  ) {
    const orderFiles: OrderFile[] = [];
    const configuration = await this.createConfiguration(createOrderFile.configuration, manager);

    for (let i = 0; i < createOrderFile.copies; i++) {
      orderFiles.push(
        new OrderFile({
          ...createOrderFile,
          file: new File({ id: createOrderFile.fileId }),
          state: initialState,
          configuration,
          ...(!!createOrderFile.bindingGroups &&
            !!createOrderFile.bindingGroups[i] && {
              bindingGroup: bindingGroupsMap.get(createOrderFile.bindingGroups[i].id),
              position: createOrderFile.bindingGroups[i].position,
            }),
        }),
      );
    }

    return orderFiles;
  }

  private createConfiguration(createConfigurationDto: CreateConfigurationDto, manager: EntityManager) {
    return manager.getRepository(Configuration).save(createConfigurationDto);
  }

  async update(id: string, updateOrderFileDto: PartialUpdateOrderFileDto, manager: EntityManager, user: UserIdentity) {
    const orderFile = await this.findOne(id, manager, user);

    await this.checkUpdateConditions(updateOrderFileDto, orderFile);

    const updateState = !!updateOrderFileDto.state;
    let desiredState: FileState;
    if (updateState) {
      desiredState = await this.findFileStateByCode(updateOrderFileDto.state.code, manager);
    }

    const updatedOrderFile = await this.getOrderFilesRepository(manager).updateAndReload(
      id,
      { ...updateOrderFileDto, ...(updateOrderFileDto.state && { state: desiredState }) },
      this.getFindOneRelations(),
    );

    //! Order must be updated AFTER saving updated orderFile in order for
    //! 'checkAllOrderFilesFromBindingGroupArePrinted' method to work with all tuples updated in database
    if (updateState) {
      await this.transitionOrderState(updateOrderFileDto, orderFile, manager, user);
    }

    this.ordersGateway.emitUpdatedOrderFile(updatedOrderFile);
    return updatedOrderFile;
  }

  protected async checkUpdateConditions(updateOrderFileDto: PartialUpdateOrderFileDto, orderFile: OrderFile) {
    //* Only Admin and Campus roles have access to update order file
    if (updateOrderFileDto.state) {
      orderFile.fsm.checkTransitionIsValid(updateOrderFileDto.state.code);
      this.checkOrderFileCanBeUpdatedBasedOnOrderState(orderFile.order.state.code);
    }
  }

  private checkOrderFileCanBeUpdatedBasedOnOrderState(currentOrderState: EOrderState) {
    const orderStatesInWhichOrderFileCanBeUpdated = [EOrderState.REQUESTED, EOrderState.IN_PROCESS];

    if (!orderStatesInWhichOrderFileCanBeUpdated.includes(currentOrderState)) {
      throw new BadRequestException(
        'El pedido-archivo no puede ser actualizado ya que el pedido no se encuentra en ninguno de los estados correctos ("Solicitado" o "En proceso").',
      );
    }
  }

  private async transitionOrderState(
    { state, printerId }: PartialUpdateOrderFileDto,
    { id, order, file, configuration }: OrderFile,
    manager: EntityManager,
    user: UserIdentity,
  ) {
    if (state.code === EFileState.PRINTING) {
      //* Create callback with a new transaction built from the same connection as the original manager
      const callback = () =>
        manager.connection.transaction(
          IsolationLevel.REPEATABLE_READ,
          async (manager) => await this.transitionOrderFileToPrinted(id, manager, user),
        );

      await this.printersService.printFile(printerId, file, configuration, callback);

      if (order.state.code === EOrderState.REQUESTED) {
        await this.ordersService.update(order.id, { state: { code: EOrderState.IN_PROCESS } }, manager, user);
      }
    } else {
      //* state.code === EFileState.PRINTED
      if (order.state.code !== EOrderState.IN_PROCESS) {
        //* In case order isn't in IN PROCESS state (first file to print is transitioned directly to PRINTED)
        await this.ordersService.update(order.id, { state: { code: EOrderState.IN_PROCESS } }, manager, user);
      }
      if (await this.areAllOrderFilesFromOrderPrintedAndRinged(order.id, manager)) {
        await this.ordersService.update(order.id, { state: { code: EOrderState.READY } }, manager, user);
      }
    }
  }

  async transitionOrderFileToPrinted(id: string, manager: EntityManager, user: UserIdentity) {
    return this.update(id, { state: { code: EFileState.PRINTED } }, manager, user);
  }

  async areAllOrderFilesFromOrderPrintedAndRinged(orderId: string, manager: EntityManager) {
    const orderFiles = await this.findOrderFilesByOrderId(orderId, manager);

    let i = 0;
    while (i < orderFiles.length && this.isOrderFileReady(orderFiles[i])) {
      i++;
    }

    return i === orderFiles.length;
  }

  private isOrderFileReady(orderFile: OrderFile) {
    return (
      this.isOrderFilePrinted(orderFile.state.code) &&
      (!orderFile.bindingGroup || this.isBindingGroupRinged(orderFile.bindingGroup.state.code))
    );
  }

  isOrderFilePrinted(code: EFileState) {
    return code === EFileState.PRINTED;
  }

  private isBindingGroupRinged(code: EBindingGroupState) {
    return code === EBindingGroupState.RINGED;
  }

  //! Implemented to avoid deletion of order files by error by other developers
  async remove(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  private getOrderFilesRepository(manager: EntityManager) {
    return manager.getCustomRepository(OrderFilesRepository);
  }

  private getFileStatesRepository(manager: EntityManager) {
    return manager.getRepository(FileState);
  }

  async findFileStateByCode(code: EFileState, manager: EntityManager) {
    const state = await this.getFileStatesRepository(manager).findOne({ where: { code } });

    if (state) {
      return state;
    } else {
      throw new NotFoundException('File state not found.');
    }
  }

  protected getFindOneRelations(): string[] {
    return ['order', 'file', 'configuration', 'bindingGroup'];
  }

  protected throwCustomNotFoundException(id: string): void {
    throw new NotFoundException(`Pedido-archivo ${id} no encontrado.`);
  }
}
