import { BadRequestException } from '@nestjs/common';

export class InvalidIdTokenException extends BadRequestException {
  constructor() {
    super('Id Token inválido.');
  }
}
