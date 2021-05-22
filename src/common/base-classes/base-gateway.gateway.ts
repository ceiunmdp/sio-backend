/* eslint-disable @typescript-eslint/no-unused-vars */
import { UseFilters, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { OnGatewayConnection, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Namespace } from 'socket.io';
import { CampusUsersService } from 'src/users/campus-users/campus-users.service';
import { Connection } from 'typeorm';
import { AllExceptionsFilter } from '../filters/all-exceptions.filter';
import { AuthNGuard } from '../guards/authn.guard';
import { ErrorsInterceptor } from '../interceptors/errors.interceptor';
import { LoggerInterceptor } from '../interceptors/logger.interceptor';
import { SerializerInterceptor } from '../interceptors/serializer.interceptor';
import { TimeoutInterceptor } from '../interceptors/timeout.interceptor';
import { TransformInterceptor } from '../interceptors/transform.interceptor';
import { SocketWithUserData } from '../interfaces/socket-with-user-data.interface';
import { isCampus } from '../utils/is-role-functions';

@UseInterceptors(ErrorsInterceptor, LoggerInterceptor, TimeoutInterceptor, TransformInterceptor, SerializerInterceptor)
@UsePipes(ValidationPipe)
@UseFilters(AllExceptionsFilter)
export abstract class BaseGateway implements OnGatewayConnection {
  @WebSocketServer()
  protected namespace: Namespace;

  constructor(
    protected readonly connection: Connection,
    private readonly authNGuard: AuthNGuard,
    protected readonly campusUsersService: CampusUsersService,
  ) {}

  //* Cannot use Guards or Filters (catch exceptions) with this method
  async handleConnection(client: SocketWithUserData) {
    const token = client.handshake.query.token;

    if (token) {
      client.user = await this.authNGuard.verifyAndDecodeToken(token, false);
      if (!isCampus(client.user)) {
        client.disconnect(true);
      } else {
        const campusUser = await this.campusUsersService.findOne(client.user.id, this.connection.manager, client.user);
        client.join(campusUser.campusId);
      }
    } else {
      client.disconnect(true);
    }
  }

  protected buildWsResponse<T>(event: string, data: T): WsResponse<T> {
    return { event, data };
  }

  protected emitEvent(event: string, data: any, options?: { room?: string }) {
    // let destination: Server | Namespace = options?.namespace ? this.server.of(options.namespace) : this.server;

    // if (options?.room) {
    //   destination = destination.to(options.room);
    // }

    const destination = options?.room ? this.namespace.to(options.room) : this.namespace;
    this.sendEvent(destination, event, data);
  }

  private sendEvent(destination: Namespace, event: string, data: any) {
    destination.emit(event, data);
  }
}
