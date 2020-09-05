import { UserNotFoundException } from './user-not-found.exception';

export class UserNotFoundInFirebaseException extends UserNotFoundException {
  constructor(id?: string) {
    super(`Usuario ${id ? id + ' ' : ''}no encontrado.`);
  }
}
