import { UserNotFoundException } from './user-not-found.exception';

export class UserNotFoundInDatabaseException extends UserNotFoundException {
  constructor(readonly id: string) {
    super(`Usuario ${id} no encontrado.`);
  }
}
