import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import * as admin from 'firebase-admin';
import { Observable } from 'rxjs';
import { CustomLoggerService } from 'src/logger/custom-logger.service';
import { UserRole } from '../enums/user-role.enum';
import { InvalidIdTokenException } from '../exceptions/invalid-id-token.exception';
import { UserIdentity } from '../interfaces/user-identity.interface';
import { handleFirebaseError } from '../utils/firebase-handler';

@Injectable()
export class AuthNGuard implements CanActivate {
  constructor(private readonly logger: CustomLoggerService) {
    this.logger.context = AuthNGuard.name;
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authorization = request.headers.authorization as string;
    if (authorization) {
      const idToken = authorization.split(' ')[1];
      return this.validateRequest(request, idToken);
    } else {
      return false;
    }
  }

  //! Firebase idToken's payload
  // {
  //   iss: 'https://securetoken.google.com/icei-d3c94',
  //   aud: 'icei-d3c94',
  //   auth_time: 1598882497,
  //   user_id: 'eFBjrJtPnLMRjCVSs4gnXOvLBsz2',
  //   sub: 'eFBjrJtPnLMRjCVSs4gnXOvLBsz2',
  //   iat: 1598883278,
  //   exp: 1598886878,
  //   email: 'manuucci96@gmail.com',
  //   email_verified: false,
  //   firebase: {
  //     identities: {
  //       email: [
  //         "manuucci96@gmail.com"
  //       ]
  //     },
  //     sign_in_provider: 'password'
  //   },
  //   uid: 'eFBjrJtPnLMRjCVSs4gnXOvLBsz2'
  // }

  async validateRequest(request: Request, idToken: string) {
    try {
      const decodedIdToken = await this.verifyAndDecodeIdToken(idToken);

      if (decodedIdToken.email_verified) {
        request.user = decodedIdToken;
        return true;
      } else {
        //! Momentarily
        // return false;

        request.user = decodedIdToken;
        return true;
      }
    } catch (error) {
      const exception = handleFirebaseError(error);
      if (exception instanceof InvalidIdTokenException) {
        //! Momentarily
        return false;

        // request.user = { id: '[UUID]', role: UserRole.ADMIN };
        // request.user = { id: '4cef4120-d3f6-45e6-ab50-8a49c5b0a044', role: UserRole.ADMIN };
        // return true;
      } else {
        throw error;
      }
    }
  }

  async verifyAndDecodeIdToken(idToken: string) {
    // TODO: Evaluate is the additional verification is required to the authentication flow (mostly of students)
    // const decodedIdToken = await admin.auth().verifyIdToken(idToken);
    const decodedIdToken = await admin.auth().verifyIdToken(idToken, true);
    return {
      ...decodedIdToken,
      ...(!decodedIdToken.id && { id: decodedIdToken.uid, role: UserRole.STUDENT.toString() }),
    } as UserIdentity;
  }
}
