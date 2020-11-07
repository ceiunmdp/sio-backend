import { UseFilters, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { OnGatewayConnection, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { AllExceptionsFilter } from '../filters/all-exceptions.filter';
import { ErrorsInterceptor } from '../interceptors/errors.interceptor';
import { LoggerInterceptor } from '../interceptors/logger.interceptor';
import { SerializerInterceptor } from '../interceptors/serializer.interceptor';
import { TimeoutInterceptor } from '../interceptors/timeout.interceptor';
import { TransformInterceptor } from '../interceptors/transform.interceptor';
import { SocketWithUserData } from '../interfaces/socket-with-user-data.interface';

@UseInterceptors(ErrorsInterceptor, LoggerInterceptor, TimeoutInterceptor, TransformInterceptor, SerializerInterceptor)
@UsePipes(ValidationPipe)
@UseFilters(AllExceptionsFilter)
export class BaseGateway implements OnGatewayConnection {
  @WebSocketServer()
  protected server: Server;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async handleConnection(_client: SocketWithUserData) {
    return;
  }

  protected buildWsResponse<T>(event: string, data: T): WsResponse<T> {
    return { event, data };
  }

  protected emitEvent(event: string, data: any, options?: { namespace?: string; room?: string }) {
    let namespace: SocketIO.Namespace;

    if (options?.namespace) {
      namespace = this.server.of(options.namespace);
    }

    if (options?.room) {
      namespace ? namespace.to(options.room) : this.server.to(options.room);
    }

    namespace ? namespace.emit(event, data) : this.server.emit(event, data);
  }
}
