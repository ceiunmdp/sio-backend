import { UnauthorizedException } from '@nestjs/common';

export class InvalidIdTokenException extends UnauthorizedException {
  constructor() {
    super('Id Token inválido.');
  }
}
