import { Catch } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { CustomError } from '../classes/custom-error.class';
import { InternalErrorWs } from '../interfaces/internal-error-ws.interface';

@Catch(WsException)
export class WsExceptionFilter extends BaseWsExceptionFilter<WsException> {
  // TODO: Change 'any' to specific class or interface: Socket
  handleError(client: any, exception: WsException) {
    if (!(exception instanceof WsException)) {
      return super.handleUnknownError(exception, client);
    }

    const [name, message] = this.getNameAndMessage(exception);
    client.emit('exception', this.buildWsError(client, { name, message }));
  }

  private getNameAndMessage(exception: WsException) {
    return this.getNameAndMessageProperties(exception.getError());
  }

  private getNameAndMessageProperties(stringOrObject: string | unknown) {
    if (typeof stringOrObject === 'string') {
      const str = stringOrObject as string;
      return [str, str];
    } else {
      const { name, message } = stringOrObject as Error;
      return [name, message];
    }
  }

  private buildWsError(client: Socket, { name, message }: InternalErrorWs) {
    return new CustomError({
      name,
      message,
      timestamp: new Date().toISOString(),
      path: `${client.nsp.name}${client.nsp.server.path()}`,
    });
  }
}
