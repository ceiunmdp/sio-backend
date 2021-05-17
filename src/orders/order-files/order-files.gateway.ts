/* eslint-disable @typescript-eslint/no-unused-vars */
import { forwardRef, Inject } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { WebSocketGateway } from '@nestjs/websockets';
import { BaseGateway } from 'src/common/base-classes/base-gateway.gateway';
import { Namespace } from 'src/common/constants/namespace.constant';
import { Mapper } from 'src/common/decorators/mapper.decorator';
import { Path } from 'src/common/enums/path.enum';
import { AuthNGuard } from 'src/common/guards/authn.guard';
import { SocketWithUserData } from 'src/common/interfaces/socket-with-user-data.interface';
import { getToken } from 'src/common/utils/get-token';
import { isCampus } from 'src/common/utils/is-role-functions';
import { CampusUsersService } from 'src/users/campus-users/campus-users.service';
import { Connection } from 'typeorm';
import { BindingGroup } from '../binding-groups/entities/binding-group.entity';
import { ResponseOrderFileDto } from './dtos/response/response-order-file.dto';
import { OrderFile } from './entities/order-file.entity';
import { OrderFileEvent } from './enums/order-file-event.enum';
import { OrderFilesService } from './order-files.service';

@WebSocketGateway({
  namespace: Namespace.ORDERS,
  path: Path.ORDER_FILES,
  perMessageDeflate: false,
})
export class OrderFilesGateway extends BaseGateway {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly authNGuard: AuthNGuard,
    private readonly campusUsersService: CampusUsersService,
    @Inject(forwardRef(() => OrderFilesService)) private readonly orderFilesService: OrderFilesService,
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

  @Mapper(ResponseOrderFileDto)
  //! Exclude properties from object passed as parameter
  emitUpdatedOrderFile({ fsm, order, bindingGroup, ...orderFile }: OrderFile) {
    // TODO: Check if mapping is made
    this.emitEvent(OrderFileEvent.UPDATED_ORDER_FILE, this.buildData(orderFile, bindingGroup), {
      namespace: Namespace.ORDER_FILES,
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
}
