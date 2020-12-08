import { Injectable, InternalServerErrorException } from '@nestjs/common';
import admin from 'firebase-admin';
import { CustomLoggerService } from 'src/global/custom-logger.service';
import { UserNotFoundInFirebaseException } from 'src/users/users/exceptions/user-not-found-in-firebase.exception';
import { FirebaseError } from '../common/enums/firebase-error';
import { EmailAlreadyExistsException } from '../common/exceptions/email-already-exists.exception';
import { InvalidIdTokenException } from '../common/exceptions/invalid-id-token.exception';

@Injectable()
export class FirebaseErrorHandlerService {
  constructor(private readonly logger: CustomLoggerService) {
    this.logger.context = FirebaseErrorHandlerService.name;
  }

  handleError(error: admin.FirebaseError) {
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
          this.logFirebaseError(error);
          return new InternalServerErrorException();
        case FirebaseError.USER_NOT_FOUND:
          return new UserNotFoundInFirebaseException();
        case FirebaseError.INTERNAL_ERROR:
        default:
          this.logFirebaseError(error);
          return new InternalServerErrorException(
            'Problema con proveedor externo. Consulte con el administrador del sistema.',
          );
      }
    } else {
      return error;
    }
  }

  private logFirebaseError(error: admin.FirebaseError) {
    this.logger.error(`Firebase Error.\nCode: ${error.code}\nMessage: ${error.message}`);
  }
}
