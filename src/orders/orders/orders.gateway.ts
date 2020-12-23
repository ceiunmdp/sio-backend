/* eslint-disable @typescript-eslint/no-unused-vars */
import { forwardRef, Inject } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { MessageBody, SubscribeMessage, WebSocketGateway, WsResponse } from '@nestjs/websockets';
import { defer, from, Observable } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { BaseGateway } from 'src/common/base-classes/base-gateway.gateway';
import { Namespace } from 'src/common/constants/namespace.constant';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Mapper } from 'src/common/decorators/mapper.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { IsolationLevel } from 'src/common/enums/isolation-level.enum';
import { Path } from 'src/common/enums/path.enum';
import { UserRole } from 'src/common/enums/user-role.enum';
import { AuthNGuard } from 'src/common/guards/authn.guard';
import { SocketWithUserData } from 'src/common/interfaces/socket-with-user-data.interface';
import { UserIdentity } from 'src/common/interfaces/user-identity.interface';
import { getToken } from 'src/common/utils/get-token';
import { isCampus } from 'src/common/utils/is-role-functions';
import { CampusUsersService } from 'src/users/campus-users/campus-users.service';
import { Connection } from 'typeorm';
import { ResponseOrderDto } from './dtos/response/response-order.dto';
import { UpdateOrderDto } from './dtos/update/update-order.dto';
import { Order } from './entities/order.entity';
import { OrderEvent } from './enums/order-event.enum';
import { OrdersService } from './orders.service';

@WebSocketGateway({
  namespace: Namespace.ORDERS,
  path: Path.ORDERS,
  perMessageDeflate: false,
})
export class OrdersGateway extends BaseGateway {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly authNGuard: AuthNGuard,
    private readonly campusUsersService: CampusUsersService,
    @Inject(forwardRef(() => OrdersService)) private readonly ordersService: OrdersService,
  ) {
    super();
  }

  //* Cannot use Guards or Filters (catch exceptions) with this method
  async handleConnection(client: SocketWithUserData) {
    client.user = await this.authNGuard.verifyAndDecodeToken(getToken(client.handshake.headers.authorization), false);

    if (!isCampus(client.user)) {
      client.disconnect(true);
    } else {
      const campusUser = await this.campusUsersService.findOne(client.user.id, this.connection.manager, client.user);
      client.join(campusUser.campusId);
    }
  }

  @Auth(UserRole.CAMPUS)
  @SubscribeMessage(OrderEvent.PENDING_ORDERS)
  @Mapper(ResponseOrderDto)
  findAllPendingOrders(@User() user: UserIdentity): Observable<WsResponse<Order>> {
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

  @Auth(UserRole.CAMPUS)
  @SubscribeMessage(OrderEvent.UPDATE_ORDER)
  @Mapper(ResponseOrderDto)
  update(@MessageBody() updateOrderDto: UpdateOrderDto, @User() user: UserIdentity) {
    // TODO: Check if validation is run
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager) => {
      const order = await this.ordersService.update(updateOrderDto.id, updateOrderDto, manager, user);
      return this.buildWsResponse(OrderEvent.UPDATE_ORDER, order);
    });
  }

  @Mapper(ResponseOrderDto)
  //! Exclude both properties from object passed as parameter
  emitNewPendingOrder({ fsmStaff, fsmStudent, ...order }: Order) {
    this.emitEvent(OrderEvent.NEW_PENDING_ORDER, order, {
      namespace: Namespace.ORDERS,
      room: order.campusId,
    });
  }

  @Mapper(ResponseOrderDto)
  //! Exclude both properties from object passed as parameter
  emitUpdatedOrder({ fsmStaff, fsmStudent, ...order }: Order) {
    this.emitEvent(OrderEvent.UPDATED_ORDER, order, {
      namespace: Namespace.ORDERS,
      room: order.campusId,
    });
  }
}
