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
import { OrderFile } from '../order-files/entities/order-file.entity';
import { BindingGroupsService } from './binding-groups.service';
import { ResponseBindingGroupDto } from './dtos/response-binding-group.dto';
import { BindingGroup } from './entities/binding-group.entity';
import { BindingGroupEvent } from './enums/binding-group-event.enum';

@WebSocketGateway({
  namespace: Namespace.ORDERS,
  path: Path.BINDING_GROUPS,
  perMessageDeflate: false,
})
export class BindingGroupsGateway extends BaseGateway {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly authNGuard: AuthNGuard,
    private readonly campusUsersService: CampusUsersService,
    @Inject(forwardRef(() => BindingGroupsService)) private readonly bindingGroupsService: BindingGroupsService,
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

  @Mapper(ResponseBindingGroupDto)
  //! Exclude properties from object passed as parameter
  async emitUpdatedBindingGroup({ fsm, orderFiles, ...bindingGroup }: BindingGroup) {
    // TODO: Check if mapping is made
    this.emitEvent(
      BindingGroupEvent.UPDATE_BINDING_GROUP,
      { ...bindingGroup, orderFiles: this.removeUnnecesaryProperties(orderFiles) },
      {
        namespace: Namespace.BINDING_GROUPS,
        room: orderFiles[0].order.id,
      },
    );
  }

  private removeUnnecesaryProperties(orderFiles: OrderFile[]) {
    return orderFiles.map(({ fsm, order, ...orderFile }) => orderFile);
  }
}
