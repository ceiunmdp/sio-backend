/* eslint-disable @typescript-eslint/no-unused-vars */
import { forwardRef, Inject } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { SubscribeMessage, WebSocketGateway, WsResponse } from '@nestjs/websockets';
import { defer, from, Observable } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { Socket } from 'socket.io';
import { BaseGateway } from 'src/common/base-classes/base-gateway.gateway';
import { Namespace } from 'src/common/constants/namespace.constant';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Mapper } from 'src/common/decorators/mapper.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { IsolationLevel } from 'src/common/enums/isolation-level.enum';
import { UserRole } from 'src/common/enums/user-role.enum';
import { AuthNGuard } from 'src/common/guards/authn.guard';
import { UserIdentity } from 'src/common/interfaces/user-identity.interface';
import { CustomLoggerService } from 'src/global/custom-logger.service';
import { CampusUsersService } from 'src/users/campus-users/campus-users.service';
import { Connection } from 'typeorm';
import { ResponseBindingGroupDto } from '../binding-groups/dtos/response-binding-group.dto';
import { BindingGroup } from '../binding-groups/entities/binding-group.entity';
import { BindingGroupEvent } from '../binding-groups/enums/binding-group-event.enum';
import { ResponseOrderFileDto } from '../order-files/dtos/response/response-order-file.dto';
import { OrderFile } from '../order-files/entities/order-file.entity';
import { OrderFileEvent } from '../order-files/enums/order-file-event.enum';
import { ResponseOrderDto } from './dtos/response/response-order.dto';
import { Order } from './entities/order.entity';
import { OrderEvent } from './enums/order-event.enum';
import { OrdersService } from './orders.service';

@WebSocketGateway({
  namespace: Namespace.ORDERS,
  // path: Path.ORDERS
})
export class OrdersGateway extends BaseGateway {
  constructor(
    private readonly logger: CustomLoggerService,
    @InjectConnection() connection: Connection,
    authNGuard: AuthNGuard,
    campusUsersService: CampusUsersService,
    @Inject(forwardRef(() => OrdersService)) private readonly ordersService: OrdersService,
  ) {
    super(connection, authNGuard, campusUsersService);
    this.logger.context = OrdersGateway.name;
  }

  //* OrdersGateway
  @Auth(UserRole.CAMPUS)
  @SubscribeMessage(OrderEvent.PENDING_ORDERS)
  @Mapper(ResponseOrderDto)
  findAllPendingOrders(@User() user: UserIdentity): Observable<WsResponse<Order>> {
    this.logger.log('Triggered event PENDING_ORDERS');
    return defer(
      (() => {
        return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager) => {
          const campusUser = await this.campusUsersService.findOne(user.id, manager, user);
          return this.ordersService.findAllPendingOrdersByCampusId(campusUser.campusId, manager);
        });
      }).bind(this, user),
    ).pipe(
      concatMap((orders: Order[]) =>
        from(orders).pipe(map((order) => this.buildWsResponse(OrderEvent.PENDING_ORDERS, order))),
      ),
    );
  }

  @Mapper(ResponseOrderDto)
  //! Exclude both properties from object passed as parameter
  emitNewPendingOrder({ fsmStaff, fsmStudent, ...order }: Order) {
    this.logger.log('Emit event NEW_PENDING_ORDER');
    this.emitEvent(OrderEvent.NEW_PENDING_ORDER, order, {
      room: order.campusId,
    });
  }

  @Mapper(ResponseOrderDto)
  //! Exclude both properties from object passed as parameter
  emitUpdatedOrder({ fsmStaff, fsmStudent, ...order }: Order) {
    this.logger.log('Emit event UPDATED_ORDER');
    this.emitEvent(OrderEvent.UPDATED_ORDER, order, {
      room: order.campusId,
    });
  }

  @Auth(UserRole.CAMPUS)
  @SubscribeMessage(OrderEvent.JOIN_ORDER_ROOM)
  joinOrderRoom(client: Socket, { orderId }: { orderId: string }) {
    this.logger.log('Triggered event JOINED_ORDER_ROOM');
    client.join(orderId);
    return this.buildWsResponse(OrderEvent.JOINED_ORDER_ROOM, { orderId });
  }

  @Auth(UserRole.CAMPUS)
  @SubscribeMessage(OrderEvent.LEAVE_ORDER_ROOM)
  leaveOrderRoom(client: Socket, { orderId }: { orderId: string }) {
    this.logger.log('Triggered event LEFT_ORDER_ROOM');
    client.leave(orderId);
    return this.buildWsResponse(OrderEvent.LEFT_ORDER_ROOM, { orderId });
  }
  //* ---

  // TODO: Migrate logic to appropiate gateway after NestJS v8 release
  //* OrderFilesGateway
  @Mapper(ResponseOrderFileDto)
  //! Exclude properties from object passed as parameter
  emitUpdatedOrderFile({ fsm, order, bindingGroup, ...orderFile }: OrderFile) {
    this.logger.log('Emit event UPDATED_ORDER_FILE');
    // TODO: Check if mapping is made
    this.emitEvent(OrderFileEvent.UPDATED_ORDER_FILE, this.buildData(orderFile, bindingGroup), {
      room: order.id,
    });
  }

  private buildData(orderFile: Partial<OrderFile>, bindingGroup: BindingGroup) {
    if (bindingGroup) {
      const { fsm, ...bindingGroupExceptFsm } = bindingGroup;
      return { ...orderFile, bindingGroup: bindingGroupExceptFsm };
    } else {
      return orderFile;
    }
  }
  //* ---

  //* BindingGroupsGateway
  @Mapper(ResponseBindingGroupDto)
  //! Exclude properties from object passed as parameter
  async emitUpdatedBindingGroup({ fsm, orderFiles, ...bindingGroup }: BindingGroup) {
    this.logger.log('Emit event UPDATED_BINDING_GROUP');
    // TODO: Check if mapping is made
    this.emitEvent(
      BindingGroupEvent.UPDATED_BINDING_GROUP,
      { ...bindingGroup, orderFiles: this.removeUnnecesaryProperties(orderFiles) },
      {
        room: orderFiles[0].order.id,
      },
    );
  }

  private removeUnnecesaryProperties(orderFiles: OrderFile[]) {
    return orderFiles.map(({ fsm, order, ...orderFile }) => orderFile);
  }
  //* ---
}
