import { BadRequestException } from '@nestjs/common';

export class ExceededAvailableStorageException extends BadRequestException {
  constructor() {
    super(`Ha alcanzado el límite de espacio de almacenamiento permitido.`);
  }
}
