import { BadRequestException } from '@nestjs/common';

export class InsufficientMoneyException extends BadRequestException {
  constructor() {
    super(`No cuenta con suficiente dinero en la cuenta para realizar la operación.`);
  }
}
