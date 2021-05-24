import { WsException } from '@nestjs/websockets';

export class UnauthorizedWsException extends WsException {
  constructor(message: string) {
    super({
      name: 'Unauthorized',
      message,
    });
  }
}
