import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Request } from 'express';
import * as admin from 'firebase-admin';
import { CustomLoggerService } from 'src/global/custom-logger.service';
import { FirebaseErrorHandlerService } from '../../global/firebase-error-handler.service';
import { Environment } from '../enums/environment.enum';
import { ExpiredIdTokenException } from '../exceptions/expired-id-token.exception';
import { InvalidIdTokenException } from '../exceptions/invalid-id-token.exception';
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
        await this.verifyDecodeAndAttachTokenPayload(authorization, request, isHttp);
      } else {
        throw new UnauthorizedException('Id token not provided.');
      }
    } else {
      //* WS
      const client = context.switchToWs().getClient<SocketWithUserData>();
      const authorization = client.handshake.headers.authorization;

      if (authorization) {
        await this.verifyDecodeAndAttachTokenPayload(authorization, client, isHttp);
      } else {
        throw new WsException('Id token not provided.');
      }
    }

    return true;
  }

  private async verifyDecodeAndAttachTokenPayload(
    authorization: string,
    requestOrSocket: Request | SocketWithUserData,
    isHttp: boolean,
  ) {
    requestOrSocket.user = await this.verifyAndDecodeToken(getToken(authorization), isHttp);
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
      if (!decodedIdToken.role) {
        throw new UnauthorizedException('Request new Id Token with custom claims.');
      } else if (!decodedIdToken.email_verified && process.env.NODE_ENV === Environment.PRODUCTION) {
        throw new UnauthorizedException('Email not verified.');
      } else {
        return decodedIdToken;
      }
    } catch (error) {
      const exception = this.firebaseErrorHandlerService.handleError(error);
      if (exception instanceof InvalidIdTokenException) {
        if (isHttp) {
          throw new UnauthorizedException('Invalid token.');
        } else {
          throw new WsException('Invalid token.');
        }
      } else if (exception instanceof ExpiredIdTokenException) {
        if (isHttp) {
          throw new UnauthorizedException('Expired token.');
        } else {
          throw new WsException('Expired token.');
        }
      } else {
        throw error;
      }
    }
  }

  private async verifyAndDecodeIdToken(idToken: string) {
    // TODO: Evaluate if the additional verification is required to the authentication flow
    return (admin.auth().verifyIdToken(idToken, true) as unknown) as DecodedIdToken;
  }
}
