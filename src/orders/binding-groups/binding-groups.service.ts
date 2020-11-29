import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { GenericInterface } from 'src/common/interfaces/generic.interface';
import { UserIdentity } from 'src/common/interfaces/user-identity.interface';
import { GenericCrudService } from 'src/common/services/generic-crud.service';
import { isScholarship, isStudent, isStudentOrScholarship } from 'src/common/utils/is-role-functions';
import { AppConfigService } from 'src/config/app/app-config.service';
import { Binding } from 'src/items/bindings/entities/binding.entity';
import { Connection, EntityManager, SelectQueryBuilder } from 'typeorm';
import { EFileState } from '../order-files/enums/e-file-state.enum';
import { OrderFilesService } from '../order-files/order-files.service';
import { Order } from '../orders/entities/order.entity';
import { EOrderState } from '../orders/enums/e-order-state.enum';
import { OrdersService } from '../orders/orders.service';
import { isOrderFromStudent } from '../orders/utils/is-order-from-student';
import { BindingGroupsGateway } from './binding-groups.gateway';
import { BindingGroupsRepository } from './binding-groups.repository';
import { PartialUpdateBindingGroupDto } from './dtos/partial-update-binding-group.dto';
import { BindingGroupState } from './entities/binding-group-state.entity';
import { BindingGroup } from './entities/binding-group.entity';
import { EBindingGroupState } from './enums/e-binding-group-state.enum';

@Injectable()
export class BindingGroupsService extends GenericCrudService<BindingGroup> {
  constructor(
    @InjectConnection() connection: Connection,
    appConfigService: AppConfigService,
    @Inject(forwardRef(() => BindingGroupsGateway)) private readonly bindingGroupsGateway: BindingGroupsGateway,
    @Inject(forwardRef(() => OrdersService)) private readonly ordersService: OrdersService,
    private readonly orderFilesService: OrderFilesService,
  ) {
    super(BindingGroup);
    if (!appConfigService.isProduction()) {
      this.createBindingGroupStates(connection.manager);
    }
  }

  private async createBindingGroupStates(manager: EntityManager) {
    const bindingGroupStatesRepository = this.getBindingGroupStatesRepository(manager);

    if (!(await bindingGroupStatesRepository.count())) {
      return bindingGroupStatesRepository.save([
        new BindingGroupState({ name: 'Por anillar', code: EBindingGroupState.TO_RING }),
        new BindingGroupState({ name: 'Anillado', code: EBindingGroupState.RINGED }),
      ]);
    }
  }

  //* findAll
  // TODO: Throw exception when orderId does not belong to student
  protected addExtraClauses(
    queryBuilder: SelectQueryBuilder<BindingGroup>,
    user: UserIdentity,
    parentCollectionIds: GenericInterface,
  ) {
    queryBuilder
      .innerJoin(`${queryBuilder.alias}.orderFile`, 'orderFile')
      .innerJoin('orderFile.order', 'order')
      .andWhere('order.id = :orderId', { orderId: parentCollectionIds.orderId })
      .innerJoinAndSelect(`${queryBuilder.alias}.state`, 'state');

    if (isStudent(user) || isScholarship(user)) {
      queryBuilder.andWhere('order.student_id = :studentId', { studentId: user.id });
    }

    return queryBuilder;
  }

  //* findOne
  protected async checkFindOneConditions(bindingGroup: BindingGroup, _manager: EntityManager, user: UserIdentity) {
    // TODO: Still remaining verify that bindingGroupId belongs to orderId (param)
    if (isStudentOrScholarship(user) && !isOrderFromStudent(user.id, bindingGroup.orderFile.order)) {
      throw new ForbiddenException('Prohibido el acceso al recurso.');
    }
  }

  //! Implemented to avoid creation of binding groups by error by other developers
  async create(): Promise<BindingGroup> {
    throw new Error('Method not implemented.');
  }

  async buildBindingGroupsMapWithBindingGroup(
    bindingGroupsMapWithMostAppropiateBinding: Map<number, Binding>,
    manager: EntityManager,
  ) {
    const bindingGroupsRepository = this.getBindingGroupsRepository(manager);
    const bindingGroupsMapWithBindingGroup = new Map<number, BindingGroup>();

    for (const [bindingGroupId, { name, price }] of bindingGroupsMapWithMostAppropiateBinding.entries()) {
      bindingGroupsMapWithBindingGroup.set(bindingGroupId, await bindingGroupsRepository.save({ name, price }));
    }

    return bindingGroupsMapWithBindingGroup;
  }

  async update(
    id: string,
    updateBindingGroupDto: PartialUpdateBindingGroupDto,
    manager: EntityManager,
    user: UserIdentity,
  ) {
    const bindingGroup = await this.findOne(id, manager, user);

    await this.checkUpdateConditions(updateBindingGroupDto, bindingGroup, manager);

    const desiredState = await this.findBindingGroupStateByCode(updateBindingGroupDto.state.code, manager);
    await this.transitionOrderState(desiredState, bindingGroup.orderFile.order, manager, user);

    const updatedBindingGroup = await this.getBindingGroupsRepository(manager).updateAndReload(
      id,
      { ...updateBindingGroupDto, state: desiredState },
      this.getFindOneRelations(),
    );
    this.bindingGroupsGateway.emitUpdatedBindingGroup(updatedBindingGroup);
    return updatedBindingGroup;
  }

  protected async checkUpdateConditions(
    updateBindingGroupDto: PartialUpdateBindingGroupDto,
    bindingGroup: BindingGroup,
    manager: EntityManager,
  ) {
    //* Only Admin and Campus roles have access to update binding group
    if (updateBindingGroupDto.state) {
      bindingGroup.fsm.checkTransitionIsValid(updateBindingGroupDto.state.code);
      this.checkBindingGroupCanBeUpdatedBasedOnOrderState(bindingGroup.orderFile.order.state.code);

      if (updateBindingGroupDto.state.code === EBindingGroupState.RINGED) {
        await this.checkAllOrderFilesFromBindingGroupArePrinted(bindingGroup.id, manager);
      }
    }
  }

  private checkBindingGroupCanBeUpdatedBasedOnOrderState(currentOrderState: EOrderState) {
    const orderStatesInWhichBindingGroupCanBeUpdated = [EOrderState.IN_PROCESS];

    if (!orderStatesInWhichBindingGroupCanBeUpdated.includes(currentOrderState)) {
      throw new BadRequestException(
        'El grupo de anillado no puede ser actualizado ya que el pedido no se encuentra "En proceso".',
      );
    }
  }

  private async checkAllOrderFilesFromBindingGroupArePrinted(bindingGroupId: string, manager: EntityManager) {
    const orderFiles = await this.orderFilesService.findOrderFilesByBindingGroupId(bindingGroupId, manager);

    let i = 0;
    while (i < orderFiles.length && orderFiles[i].state.code === EFileState.PRINTED) {
      i++;
    }

    if (i !== orderFiles.length) {
      throw new BadRequestException(
        'El grupo de anillado no puede ser actualizado ya que existe uno o más pedido-archivos que no han sido impresos.',
      );
    }
  }

  private async transitionOrderState(
    desiredState: BindingGroupState,
    order: Order,
    manager: EntityManager,
    user: UserIdentity,
  ) {
    if (
      desiredState.code === EBindingGroupState.RINGED &&
      this.areAllOrderFilesFromOrderPrintedAndRinged(order.id, manager)
    ) {
      await this.ordersService.update(order.id, { state: { code: EOrderState.READY } }, manager, user);
    }
  }

  private async areAllOrderFilesFromOrderPrintedAndRinged(orderId: string, manager: EntityManager) {
    const orderFiles = await this.orderFilesService.findOrderFilesByOrderId(orderId, manager);

    let i = 0;
    while (
      i < orderFiles.length &&
      orderFiles[i].state.code === EFileState.PRINTED &&
      orderFiles[i].bindingGroup?.state.code === EBindingGroupState.RINGED
    ) {
      i++;
    }

    return i === orderFiles.length;
  }

  //! Implemented to avoid deletion of binding groups by error by other developers
  async remove(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  private getBindingGroupsRepository(manager: EntityManager) {
    return manager.getCustomRepository(BindingGroupsRepository);
  }

  private getBindingGroupStatesRepository(manager: EntityManager) {
    return manager.getRepository(BindingGroupState);
  }

  async findBindingGroupStateByCode(code: EBindingGroupState, manager: EntityManager) {
    const state = await this.getBindingGroupStatesRepository(manager).findOne({ where: { code } });

    if (state) {
      return state;
    } else {
      throw new NotFoundException('Binding group state not found.');
    }
  }

  protected getFindOneRelations(): string[] {
    return ['orderFile.order'];
  }

  protected throwCustomNotFoundException(id: string): void {
    throw new Error(`Anillado ${id} no encontrado.`);
  }
}
