import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { SocketWithUserData } from '../interfaces/socket-with-user-data.interface';
import { UserIdentity } from '../interfaces/user-identity.interface';
import { isHttp } from '../utils/is-application-context-functions';

export const User = createParamDecorator((data: string, context: ExecutionContext) => {
  let user: UserIdentity;

  if (isHttp(context)) {
    user = context.switchToHttp().getRequest<Request>().user as UserIdentity;
  } else {
    //* WS
    user = context.switchToWs().getClient<SocketWithUserData>().user;
  }

  return data ? user && user[data] : user;
});
