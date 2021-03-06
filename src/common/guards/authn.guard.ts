import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import * as admin from 'firebase-admin';
import { CustomLoggerService } from 'src/global/custom-logger.service';
import { FirebaseErrorHandlerService } from '../../global/firebase-error-handler.service';
import { Environment } from '../enums/environment.enum';
import { UserRole } from '../enums/user-role.enum';
import { ExpiredIdTokenException } from '../exceptions/expired-id-token.exception';
import { InvalidIdTokenException } from '../exceptions/invalid-id-token.exception';
import { UnauthorizedWsException } from '../exceptions/unauthorized-ws-exception';
import { SocketWithUserData } from '../interfaces/socket-with-user-data.interface';
import { DecodedIdToken } from '../interfaces/user-identity.interface';
import { getToken } from '../utils/get-token';
import { isHttp as isHttpFunction } from '../utils/is-application-context-functions';

@Injectable()
export class AuthNGuard implements CanActivate {
  constructor(
    private readonly logger: CustomLoggerService,
    private readonly firebaseErrorHandlerService: FirebaseErrorHandlerService,
  ) {
    this.logger.context = AuthNGuard.name;
  }

  async canActivate(context: ExecutionContext) {
    const isHttp = isHttpFunction(context);

    if (isHttp) {
      const request = context.switchToHttp().getRequest<Request>();
      const authorization = request.headers.authorization;

      if (authorization) {
        await this.verifyDecodeAndAttachTokenPayload(getToken(authorization), request, isHttp);
      } else {
        throw new UnauthorizedException('Id token not provided.');
      }
    } else {
      //* WS
      const client = context.switchToWs().getClient<SocketWithUserData>();
      const token = client.handshake.auth.token;

      if (token) {
        await this.verifyDecodeAndAttachTokenPayload(token, client, isHttp);
      } else {
        throw new UnauthorizedWsException('Id token not provided.');
      }
    }

    return true;
  }

  private async verifyDecodeAndAttachTokenPayload(
    token: string,
    requestOrSocket: Request | SocketWithUserData,
    isHttp: boolean,
  ) {
    requestOrSocket.user = await this.verifyAndDecodeToken(token, isHttp);
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

  async verifyAndDecodeToken(idToken: string, isHttp: boolean): Promise<DecodedIdToken> {
    try {
      const decodedIdToken = await this.verifyAndDecodeIdToken(idToken);
      if (!decodedIdToken.email_verified && process.env.NODE_ENV === Environment.PRODUCTION) {
        throw new UnauthorizedException('Email not verified.');
      } else {
        if (!decodedIdToken.role) {
          //* Set provisional role just to be able to pass AuthN Guard. The role will be set later in UserIdentitySetterInterceptor
          decodedIdToken.role = UserRole.STUDENT;
        }
        return decodedIdToken;
      }
    } catch (error) {
      const exception = this.firebaseErrorHandlerService.handleError(error);
      if (exception instanceof InvalidIdTokenException) {
        if (isHttp) {
          throw new UnauthorizedException('Invalid token.');
        } else {
          //* WS
          throw new UnauthorizedWsException('Invalid token.');
        }
      } else if (exception instanceof ExpiredIdTokenException) {
        if (isHttp) {
          throw new UnauthorizedException('Expired token.');
        } else {
          //* WS
          throw new UnauthorizedWsException('Expired token.');
        }
      } else {
        throw error;
      }
    }
  }

  private async verifyAndDecodeIdToken(idToken: string) {
    // * Verify ID Token and check if it has been revoked
    return admin.auth().verifyIdToken(idToken, true) as unknown as DecodedIdToken;
  }
}
