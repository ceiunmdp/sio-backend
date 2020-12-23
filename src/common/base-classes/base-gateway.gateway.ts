/* eslint-disable @typescript-eslint/no-unused-vars */
import { UseFilters, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { OnGatewayConnection, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Namespace } from 'socket.io';
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
  //* The object injected is of type Namespace because each WebSocketGateway defines a namespace under which operates
  //* If it wasn't the case, the object injected would be of type Server
  @WebSocketServer()
  protected namespace: Namespace;

  async handleConnection(_client: SocketWithUserData) {
    return;
  }

  protected buildWsResponse<T>(event: string, data: T): WsResponse<T> {
    return { event, data };
  }

  // TODO: Define if all WebSocketGateways will be under a namespace or if it's necessary to generalize this class to deal with 'default' namespace
  protected emitEvent(event: string, data: any, options?: { namespace?: string; room?: string }) {
    let namespaceWithRoom: Namespace;

    // if (options?.namespace) {
    //   namespace = this.getNamespaceToSentEventTo(this.namespaceServer, options.namespace);
    // }

    if (options?.room) {
      // namespaceWithRoom = this.getRoomToSendEventTo(options?.namespace ? namespaceWithRoom : this.namespaceServer, options.room);
      namespaceWithRoom = this.getRoomToSendEventTo(this.namespace, options.room);
    }

    this.sendEvent(namespaceWithRoom || this.namespace, event, data);
  }

  // private getNamespaceToSentEventTo(server: Server, namespace: string) {
  //   return server.of(namespace);
  // }

  // private getRoomToSendEventTo(serverOrNamespace: Server | SocketIO.Namespace, room: string) {
  private getRoomToSendEventTo(namespace: Namespace, room: string) {
    return namespace.to(room);
  }

  // private sendEvent(serverOrNamespace: Server | Namespace, event: string, data: any) {
  private sendEvent(namespace: Namespace, event: string, data: any) {
    namespace.emit(event, data);
  }
}
