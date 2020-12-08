import { UserNotFoundException } from './user-not-found.exception';

export class UserNotFoundInDatabaseException extends UserNotFoundException {
  //* Create property id to be accessible
  constructor(readonly id: string) {
    super(`Usuario ${id} no encontrado.`);
  }
}
