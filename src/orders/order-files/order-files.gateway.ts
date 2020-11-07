import { InjectConnection } from '@nestjs/typeorm';
import { MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { BaseGateway } from 'src/common/base-classes/base-gateway.gateway';
import { Namespace } from 'src/common/constants/namespace.constant';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Mapper } from 'src/common/decorators/mapper.decorator';
import { IsolationLevel } from 'src/common/enums/isolation-level.enum';
import { Path } from 'src/common/enums/path.enum';
import { UserRole } from 'src/common/enums/user-role.enum';
import { AuthNGuard } from 'src/common/guards/authn.guard';
import { SocketWithUserData } from 'src/common/interfaces/socket-with-user-data.interface';
import { getToken } from 'src/common/utils/get-token';
import { isCampus } from 'src/common/utils/is-role-functions';
import { CampusUsersService } from 'src/users/campus-users/campus-users.service';
import { Connection } from 'typeorm';
import { ResponseOrderFileDto } from './dtos/response/response-order-file.dto';
import { UpdateOrderFileDto } from './dtos/update/update-order-file.dto';
import { OrderFileEvent } from './enums/order-file-event.enum';
import { OrderFilesService } from './order-files.service';

@WebSocketGateway({
  namespace: Namespace.ORDER_FILES,
  path: Path.ORDER_FILES,
  perMessageDeflate: false,
})
export class OrderFilesGateway extends BaseGateway {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly authNGuard: AuthNGuard,
    private readonly campusUsersService: CampusUsersService,
    private readonly orderFilesService: OrderFilesService,
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
  @SubscribeMessage(OrderFileEvent.UPDATE_ORDER_FILE)
  @Mapper(ResponseOrderFileDto)
  update(@MessageBody() updateOrderFileDto: UpdateOrderFileDto) {
    // TODO: Check if validation is run
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager) => {
      const orderFile = await this.orderFilesService.update(updateOrderFileDto.id, updateOrderFileDto, manager);
      this.emitEvent(OrderFileEvent.UPDATE_ORDER_FILE, orderFile, {
        namespace: Namespace.ORDER_FILES,
        room: orderFile.order.campusId,
      });
      return this.buildWsResponse(OrderFileEvent.UPDATE_ORDER_FILE, orderFile);
    });
  }
}
