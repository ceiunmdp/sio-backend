import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { UserIdentity } from '../interfaces/user-identity.interface';

export const User = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request: Request = ctx.switchToHttp().getRequest();
  const user = request.user as UserIdentity;

  return data ? user && user[data] : user;
});
