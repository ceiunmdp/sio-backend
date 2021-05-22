/* eslint-disable @typescript-eslint/no-unused-vars */
import { InjectConnection } from '@nestjs/typeorm';
import { WebSocketGateway } from '@nestjs/websockets';
import { BaseGateway } from 'src/common/base-classes/base-gateway.gateway';
import { Mapper } from 'src/common/decorators/mapper.decorator';
import { Path } from 'src/common/enums/path.enum';
import { AuthNGuard } from 'src/common/guards/authn.guard';
import { CampusUsersService } from 'src/users/campus-users/campus-users.service';
import { Connection } from 'typeorm';
import { OrderFile } from '../order-files/entities/order-file.entity';
import { ResponseBindingGroupDto } from './dtos/response-binding-group.dto';
import { BindingGroup } from './entities/binding-group.entity';
import { BindingGroupEvent } from './enums/binding-group-event.enum';

@WebSocketGateway({ path: Path.BINDING_GROUPS })
export class BindingGroupsGateway extends BaseGateway {
  constructor(
    @InjectConnection() connection: Connection,
    authNGuard: AuthNGuard,
    campusUsersService: CampusUsersService,
  ) {
    super(connection, authNGuard, campusUsersService);
  }

  @Mapper(ResponseBindingGroupDto)
  //! Exclude properties from object passed as parameter
  async emitUpdatedBindingGroup({ fsm, orderFiles, ...bindingGroup }: BindingGroup) {
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
}
