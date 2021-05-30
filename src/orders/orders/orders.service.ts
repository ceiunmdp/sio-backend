import { ForbiddenException, forwardRef, Inject, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { UserRole } from 'src/common/enums/user-role.enum';
import { UserIdentity } from 'src/common/interfaces/user-identity.interface';
import { GenericCrudService } from 'src/common/services/generic-crud.service';
import { isStudent, isStudentOrScholarship } from 'src/common/utils/is-role-functions';
import { AppConfigService } from 'src/config/app/app-config.service';
import { ParameterType } from 'src/config/parameters/enums/parameter-type.enum';
import { ParametersService } from 'src/config/parameters/parameters.service';
import { Campus } from 'src/faculty-entities/campus/entities/campus.entity';
import { BindingsService } from 'src/items/bindings/bindings.service';
import { Binding } from 'src/items/bindings/entities/binding.entity';
import { EItem } from 'src/items/items/enums/e-item.enum';
import { ItemsService } from 'src/items/items/items.service';
import { MovementsService } from 'src/movements/movements.service';
import { ScholarshipsService } from 'src/users/scholarships/scholarships.service';
import { Student } from 'src/users/students/entities/student.entity';
import { StudentsService } from 'src/users/students/students.service';
import { Connection, EntityManager, SelectQueryBuilder } from 'typeorm';
import { BindingGroupsService } from '../binding-groups/binding-groups.service';
import { BindingGroup } from '../binding-groups/entities/binding-group.entity';
import { CreateOrderFileDto } from '../order-files/dtos/create/create-order-file.dto';
import { EFileState } from '../order-files/enums/e-file-state.enum';
import { OrderFilesService } from '../order-files/order-files.service';
import { CreateOrderDto } from './dtos/create/create-order.dto';
import { PartialUpdateOrderDto } from './dtos/update/partial-update-order.dto';
import { OrderState } from './entities/order-state.entity';
import { OrderToOrderState } from './entities/order-to-order-state.entity';
import { Order } from './entities/order.entity';
import { EOrderState } from './enums/e-order-state.enum';
import { OrdersGateway } from './orders.gateway';
import { OrdersRepository } from './orders.repository';
import { isOrderFromStudent } from './utils/is-order-from-student';

@Injectable()
export class OrdersService extends GenericCrudService<Order> implements OnModuleInit {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly appConfigService: AppConfigService,
    private readonly itemsService: ItemsService,
    private readonly bindingsService: BindingsService,
    @Inject(forwardRef(() => BindingGroupsService)) private readonly bindingGroupsService: BindingGroupsService,
    @Inject(forwardRef(() => OrderFilesService)) private readonly orderFilesService: OrderFilesService,
    private readonly movementsService: MovementsService,
    private readonly parametersService: ParametersService,
    private readonly studentsService: StudentsService,
    private readonly scholarshipsService: ScholarshipsService,
    @Inject(forwardRef(() => OrdersGateway)) private readonly ordersGateway: OrdersGateway,
  ) {
    super(Order);
  }

  async onModuleInit() {
    if (!this.appConfigService.isProduction()) {
      await this.createOrderStates(this.connection.manager);
    }
  }

  private async createOrderStates(manager: EntityManager) {
    const orderStatesRepository = this.getOrderStatesRepository(manager);

    if (!(await orderStatesRepository.count())) {
      return orderStatesRepository.save([
        new OrderState({ name: 'Solicitado', code: EOrderState.REQUESTED }),
        new OrderState({ name: 'En proceso', code: EOrderState.IN_PROCESS }),
        new OrderState({ name: 'Listo para retirar', code: EOrderState.READY }),
        new OrderState({ name: 'Cancelado', code: EOrderState.CANCELLED }),
        new OrderState({ name: 'No entregado', code: EOrderState.UNDELIVERED }),
        new OrderState({ name: 'Entregado', code: EOrderState.DELIVERED }),
      ]);
    }
  }

  //* findAll
  protected addExtraClauses(queryBuilder: SelectQueryBuilder<Order>, user?: UserIdentity) {
    queryBuilder
      .innerJoinAndSelect(`${queryBuilder.alias}.student`, 'student')
      .innerJoinAndSelect(`${queryBuilder.alias}.campus`, 'campus')
      .innerJoinAndSelect(`${queryBuilder.alias}.state`, 'state')
      .innerJoinAndSelect(`${queryBuilder.alias}.orderToOrderStates`, 'tracking')
      .innerJoinAndSelect(`tracking.state`, 'state_2');

    //* /orders/me
    if (user) {
      switch (user.role) {
        case UserRole.CAMPUS:
          queryBuilder.andWhere('campus_id = :campusId', { campusId: user.id });
          break;
        case UserRole.STUDENT:
        case UserRole.SCHOLARSHIP:
          queryBuilder.andWhere('student_id = :studentId', { studentId: user.id });
          break;
        default:
          //* UserRole.ADMIN
          break;
      }
    }

    return queryBuilder;
  }

  async findAllPendingOrdersByCampusId(campusId: string, manager: EntityManager) {
    return this.getOrdersRepository(manager)
      .createQueryBuilder('order')
      .innerJoinAndSelect('order.student', 'student')
      .innerJoinAndSelect('order.campus', 'campus')
      .innerJoinAndSelect('order.state', 'state')
      .innerJoinAndSelect('order.orderToOrderStates', 'tracking')
      .innerJoinAndSelect('tracking.state', 'state_2')
      .where('campus.id = :campusId', { campusId })
      .andWhere('state.code IN (:...pendingStates)', {
        pendingStates: [EOrderState.REQUESTED, EOrderState.IN_PROCESS, EOrderState.READY],
      })
      .orderBy('order.updateDate', 'ASC')
      .getMany();
  }

  //* findOne
  protected async checkFindOneConditions(order: Order, _manager: EntityManager, user: UserIdentity) {
    if (isStudentOrScholarship(user) && !isOrderFromStudent(user.id, order)) {
      throw new ForbiddenException('Prohibido el acceso al recurso.');
    }
  }

  async create(createOrderDto: Partial<CreateOrderDto>, manager: EntityManager, user: UserIdentity) {
    const bindingGroupsMapWithNumberOfSheetsOfBG = this.orderFilesService.buildBindingGroupsMapWithNumberOfSheetsOfBG(
      createOrderDto.orderFiles,
    );
    const bindingGroupsMapWithMostAppropiateBinding = await this.buildBindingGroupsMapWithMostAppropiateBinding(
      bindingGroupsMapWithNumberOfSheetsOfBG,
      manager,
    );
    await this.calculateTotalAndSubTotals(createOrderDto, bindingGroupsMapWithMostAppropiateBinding, manager);

    const numberOfSheetsFromOrder = this.getNumberOfSheetsFromOrder(createOrderDto.orderFiles);
    createOrderDto.deposit = await this.calculateDeposit(createOrderDto.total, numberOfSheetsFromOrder, manager);
    await this.payOrder(createOrderDto, numberOfSheetsFromOrder, user, manager);

    const bindingGroupsMapWithBindingGroup = await this.bindingGroupsService.buildBindingGroupsMapWithBindingGroup(
      bindingGroupsMapWithMostAppropiateBinding,
      manager,
    );

    const order = await this.getOrdersRepository(manager).saveAndReload(
      await this.createOrder(createOrderDto, user.id, bindingGroupsMapWithBindingGroup, manager),
      this.getFindOneRelations(),
    );

    await this.movementsService.createRequestedOrderMovement(order, manager);
    this.ordersGateway.emitNewPendingOrder(order);
    return order;
  }

  private getNumberOfSheetsFromOrder(orderFiles: CreateOrderFileDto[]) {
    return orderFiles.reduce(
      (total, orderFile) => total + orderFile.configuration.numberOfSheets * orderFile.copies,
      0,
    );
  }

  private async buildBindingGroupsMapWithMostAppropiateBinding(
    bindingGroupsMapWithNumberOfSheets: Map<number, number>,
    manager: EntityManager,
  ) {
    const bindings = await this.bindingsService.findAllSortedBySheetsLimit(manager);
    const bindingGroupsMapWithMostAppropiateBinding = new Map<number, Binding>();

    bindingGroupsMapWithNumberOfSheets.forEach((numberOfSheets, bindingGroupId) => {
      bindingGroupsMapWithMostAppropiateBinding.set(
        bindingGroupId,
        this.findMostAppropiateBinding(bindings, numberOfSheets),
      );
    });

    return bindingGroupsMapWithMostAppropiateBinding;
  }

  private findMostAppropiateBinding(bindings: Binding[], numberOfSheets: number) {
    return bindings.find((binding) => binding.sheetsLimit >= numberOfSheets);
  }

  private async calculateTotalAndSubTotals(
    createOrderDto: Partial<CreateOrderDto>,
    bindingGroupsMap: Map<number, Binding>,
    manager: EntityManager,
  ) {
    const simpleSidedPrice = (await this.itemsService.findByCode(EItem.SIMPLE_SIDED, manager)).price;
    const doubleSidedPrice = (await this.itemsService.findByCode(EItem.DOUBLE_SIDED, manager)).price;
    const colourPrice = (await this.itemsService.findByCode(EItem.COLOUR, manager)).price;

    let total = 0;
    createOrderDto.orderFiles.forEach((orderFile) => {
      orderFile.total = this.orderFilesService.calculateOrderFilePrice(orderFile, {
        simpleSided: simpleSidedPrice,
        doubleSided: doubleSidedPrice,
        colour: colourPrice,
      });
      total += orderFile.total;
    });

    createOrderDto.total = total + this.calculateBindingGroupsPrice(bindingGroupsMap);
  }

  private calculateBindingGroupsPrice(bindingGroupsMap: Map<number, Binding>) {
    return Array.from(bindingGroupsMap.values()).reduce((total, binding) => total + binding.price, 0);
  }

  private async calculateDeposit(total: number, numberOfSheetsFromOrder: number, manager: EntityManager) {
    const minimumNumberOfSheetsForDeposit = await this.getMinimumNumberOfSheetsForDeposit(manager);
    const percentajeOfDeposit = await this.getPercentajeOfDeposit(manager);

    if (numberOfSheetsFromOrder >= minimumNumberOfSheetsForDeposit) {
      return (total * percentajeOfDeposit) / 100;
    } else {
      return null;
    }
  }

  private async payOrder(
    createOrderDto: Partial<CreateOrderDto>,
    numberOfSheetsFromOrder: number,
    user: UserIdentity,
    manager: EntityManager,
  ) {
    const amountPaid = createOrderDto.deposit ? createOrderDto.deposit : createOrderDto.total;
    if (isStudent(user)) {
      await this.studentsService.useUpBalance(user.id, amountPaid, manager);
    } else {
      // Scholarship
      if (createOrderDto.deposit) {
        const [newDeposit, newTotal] = await this.calculateNewDepositAndTotal(
          numberOfSheetsFromOrder,
          createOrderDto.total,
          user,
          manager,
        );
        createOrderDto.deposit = newDeposit;
        createOrderDto.total = newTotal;

        await this.scholarshipsService.useUpRemainingCopiesAndBalance(
          numberOfSheetsFromOrder,
          createOrderDto.deposit,
          user,
          manager,
        );
      } else {
        createOrderDto.total = await this.calculateNewTotal(
          numberOfSheetsFromOrder,
          createOrderDto.total,
          user,
          manager,
        );
        await this.scholarshipsService.useUpRemainingCopiesAndBalance(
          numberOfSheetsFromOrder,
          createOrderDto.total,
          user,
          manager,
        );
      }
    }
  }

  private async calculateNewDepositAndTotal(
    numberOfSheets: number,
    total: number,
    user: UserIdentity,
    manager: EntityManager,
  ) {
    const remainingCopies = (await this.scholarshipsService.findOne(user.id, manager, user)).remainingCopies;

    if (numberOfSheets > remainingCopies) {
      //* Remaining copies not enough
      const priceOfRemainingCopies = await this.getPriceOfRemainingCopies(numberOfSheets - remainingCopies, manager);

      //* We know the order qualifies for a deposit
      return [(priceOfRemainingCopies * (await this.getPercentajeOfDeposit(manager))) / 100, priceOfRemainingCopies];
    } else {
      return [null, total];
    }
  }

  private async calculateNewTotal(numberOfSheets: number, total: number, user: UserIdentity, manager: EntityManager) {
    const remainingCopies = (await this.scholarshipsService.findOne(user.id, manager, user)).remainingCopies;

    if (numberOfSheets > remainingCopies) {
      return this.getPriceOfRemainingCopies(numberOfSheets - remainingCopies, manager);
    } else {
      return total;
    }
  }

  private async getPriceOfRemainingCopies(numberOfSheets: number, manager: EntityManager) {
    // TODO: Define how price will be calculated (best or worst case scenario)
    return numberOfSheets * (await this.itemsService.findByCode(EItem.DOUBLE_SIDED, manager)).price;
  }

  private async createOrder(
    createOrderDto: Partial<CreateOrderDto>,
    userId: string,
    bindingGroupsMap: Map<number, BindingGroup>,
    manager: EntityManager,
  ) {
    const requestedState = await this.findOrderStateByCode(EOrderState.REQUESTED, manager);

    const toPrintState = await this.orderFilesService.findFileStateByCode(EFileState.TO_PRINT, manager);

    return new Order({
      ...createOrderDto,
      student: new Student({ id: userId }),
      campus: new Campus({ id: createOrderDto.campusId }),
      state: requestedState,
      orderToOrderStates: [new OrderToOrderState({ state: requestedState, timestamp: new Date() })],
      orderFiles: await this.orderFilesService.createOrderFiles(
        createOrderDto.orderFiles,
        bindingGroupsMap,
        toPrintState,
        manager,
      ),
    });
  }

  async update(id: string, updateOrderDto: PartialUpdateOrderDto, manager: EntityManager, user: UserIdentity) {
    const order = await this.findOne(id, manager, user);

    await this.checkUpdateConditions(updateOrderDto, order, manager, user);

    const desiredState = await this.findOrderStateByCode(updateOrderDto.state.code, manager);

    const updatedOrder = await this.getOrdersRepository(manager).updateAndReload(
      id,
      {
        ...updateOrderDto,
        state: desiredState,
        orderToOrderStates: [
          ...order.orderToOrderStates,
          new OrderToOrderState({ state: desiredState, timestamp: new Date() }),
        ],
      },
      this.getFindOneRelations(),
    );

    //* If order in REQUESTED state is cancelled, return money to student and create new movement
    if (order.state.code === EOrderState.REQUESTED && desiredState.code === EOrderState.CANCELLED) {
      await this.studentsService.topUpBalance(order.studentId, order.total, manager);
      await this.movementsService.createCancelledOrderMovement(order.campusId, order.studentId, order.total, manager);
    }

    this.ordersGateway.emitUpdatedOrder(updatedOrder);
    return updatedOrder;
  }

  protected async checkUpdateConditions(
    updateOrderDto: PartialUpdateOrderDto,
    order: Order,
    _manager: EntityManager,
    user: UserIdentity,
  ) {
    if (updateOrderDto.state) {
      const code = updateOrderDto.state.code;
      isStudentOrScholarship(user)
        ? order.fsmStudent.checkTransitionIsValid(code)
        : order.fsmStaff.checkTransitionIsValid(code);
    }
  }

  //! Implemented to avoid deletion of orders by error by other developers
  async remove(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  private getOrdersRepository(manager: EntityManager) {
    return manager.getCustomRepository(OrdersRepository);
  }

  private getOrderStatesRepository(manager: EntityManager) {
    return manager.getRepository(OrderState);
  }

  async findOrderStateByCode(code: EOrderState, manager: EntityManager) {
    const state = await this.getOrderStatesRepository(manager).findOne({ where: { code } });

    if (state) {
      return state;
    } else {
      throw new NotFoundException('Order state not found.');
    }
  }

  private async getMinimumNumberOfSheetsForDeposit(manager: EntityManager) {
    return (await this.parametersService.findByCode(ParameterType.ORDERS_MINIMUM_NUMBER_OF_SHEETS_FOR_DEPOSIT, manager))
      .value;
  }

  private async getPercentajeOfDeposit(manager: EntityManager) {
    return (await this.parametersService.findByCode(ParameterType.ORDERS_PERCENTAGE_OF_DEPOSIT, manager)).value;
  }

  protected getFindOneRelations(): string[] {
    return ['student', 'campus', 'orderToOrderStates'];
  }

  protected throwCustomNotFoundException(id: string) {
    throw new NotFoundException(`Pedido ${id} no encontrado.`);
  }
}
