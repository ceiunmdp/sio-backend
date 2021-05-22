/* eslint-disable @typescript-eslint/no-unused-vars */
import { InjectConnection } from '@nestjs/typeorm';
import { WebSocketGateway } from '@nestjs/websockets';
import { BaseGateway } from 'src/common/base-classes/base-gateway.gateway';
import { Mapper } from 'src/common/decorators/mapper.decorator';
import { Path } from 'src/common/enums/path.enum';
import { AuthNGuard } from 'src/common/guards/authn.guard';
import { CampusUsersService } from 'src/users/campus-users/campus-users.service';
import { Connection } from 'typeorm';
import { BindingGroup } from '../binding-groups/entities/binding-group.entity';
import { ResponseOrderFileDto } from './dtos/response/response-order-file.dto';
import { OrderFile } from './entities/order-file.entity';
import { OrderFileEvent } from './enums/order-file-event.enum';

@WebSocketGateway({ path: Path.ORDER_FILES })
export class OrderFilesGateway extends BaseGateway {
  constructor(
    @InjectConnection() connection: Connection,
    authNGuard: AuthNGuard,
    campusUsersService: CampusUsersService,
  ) {
    super(connection, authNGuard, campusUsersService);
  }

  @Mapper(ResponseOrderFileDto)
  //! Exclude properties from object passed as parameter
  emitUpdatedOrderFile({ fsm, order, bindingGroup, ...orderFile }: OrderFile) {
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
}
