import { ConflictException } from '@nestjs/common';

export class EmailAlreadyExistsException extends ConflictException {
  constructor() {
    super('El email elegido ya se encuentra en uso por otro usuario.');
  }
}
