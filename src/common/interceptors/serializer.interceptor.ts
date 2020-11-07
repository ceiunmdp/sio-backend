import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { classToPlain } from 'class-transformer';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SocketWithUserData } from '../interfaces/socket-with-user-data.interface';
import { UserIdentity } from '../interfaces/user-identity.interface';
import { isHttp } from '../utils/is-application-context-functions';

@Injectable()
export class SerializerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    let user: UserIdentity;

    if (isHttp(context)) {
      user = context.switchToHttp().getRequest<Request>().user as UserIdentity;
    } else {
      //* WS
      user = context.switchToWs().getClient<SocketWithUserData>().user;
    }

    return next.handle().pipe(map((data) => (user ? classToPlain(data, { groups: [user.role.toString()] }) : data)));
  }
}
