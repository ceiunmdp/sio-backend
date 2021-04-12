import { UnauthorizedException } from '@nestjs/common';

export class ExpiredIdTokenException extends UnauthorizedException {
  constructor() {
    super('Id Token expirado.');
  }
}
