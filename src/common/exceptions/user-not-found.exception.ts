import { NotFoundException } from '@nestjs/common';

export abstract class UserNotFoundException extends NotFoundException {
  constructor(message: string) {
    super(message);
  }
}
