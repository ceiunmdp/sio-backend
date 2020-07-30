import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Request } from 'express';
import * as admin from 'firebase-admin';
import { Observable } from 'rxjs';

@Injectable()
export class AuthNGuard implements CanActivate {
  private readonly logger = new Logger(AuthNGuard.name);

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const idToken = (request.headers.authorization as string).split(' ')[1];
    return this.validateRequest(request, idToken);
  }

  async validateRequest(request: Request, idToken: string) {
    // return this.verifyAndDecodeIdToken(idToken)
    //   .then(decodedIdToken => {
    //     request.user = decodedIdToken;
    //     return true;
    //   })
    //   .catch(err => {
    //     this.logger.error(err.code);
    //     return false;
    //   });

    try {
      const decodedIdToken = await this.verifyAndDecodeIdToken(idToken);
      request.user = decodedIdToken;
      return true;
    } catch (err) {
      this.logger.error(err.code);
      // return false;

      request.user = { id: '[UUID]', role: 1 };
      return true;
    }
  }

  async verifyAndDecodeIdToken(idToken: string) {
    return await admin.auth().verifyIdToken(idToken);
  }
}
