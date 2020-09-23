import { InternalServerErrorException } from '@nestjs/common';
import admin from 'firebase-admin';
import { UserNotFoundInFirebaseException } from 'src/users/users/exceptions/user-not-found-in-firebase.exception';
import { FirebaseError } from '../enums/firebase-error';
import { EmailAlreadyExistsException } from '../exceptions/email-already-exists.exception';
import { InvalidIdTokenException } from '../exceptions/invalid-id-token.exception';

export const handleFirebaseError = (error: admin.FirebaseError) => {
  if (!!error.code) {
    //* We're dealing with a Firebase error
    switch (error.code) {
      case FirebaseError.ARGUMENT_ERROR:
      case FirebaseError.ID_TOKEN_EXPIRED:
      case FirebaseError.ID_TOKEN_REVOKED:
      case FirebaseError.INVALID_ID_TOKEN:
        return new InvalidIdTokenException();
      case FirebaseError.EMAIL_ALREADY_EXISTS:
        return new EmailAlreadyExistsException();
      case FirebaseError.INVALID_ARGUMENT:
      case FirebaseError.INVALID_UID:
      case FirebaseError.UID_ALREADY_EXISTS:
        //* Developer's error
        logFirebaseError(error);
        return new InternalServerErrorException();
      case FirebaseError.USER_NOT_FOUND:
        return new UserNotFoundInFirebaseException();
      case FirebaseError.INTERNAL_ERROR:
      default:
        logFirebaseError(error);
        return new InternalServerErrorException(
          'Problema con proveedor externo. Consulte con el administrador del sistema.',
        );
    }
  } else {
    return error;
  }
};

const logFirebaseError = (error: admin.FirebaseError) => {
  // TODO: Resolve how to invoke logger instance
  // this.logger.error(`Firebase Error.\nCode: ${error.code}\nMessage: ${error.message}`);
  console.log(`Firebase Error.\nCode: ${error.code}\nMessage: ${error.message}`);
};
