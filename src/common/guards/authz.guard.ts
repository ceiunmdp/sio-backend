import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { UserIdentity } from '../interfaces/user-identity.interface';

@Injectable()
export class AuthZGuard implements CanActivate {
  private readonly logger = new Logger(AuthZGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get('roles', context.getHandler()) as string[];
    if (!roles) {
      return true;
    }
    const request: Request = context.switchToHttp().getRequest();
    const user = request.user as UserIdentity;
    const authorized = this.matchRoles(roles, user.role);

    if (!authorized) {
      this.logger.warn(`User ${user.id} tried to access ${request.method} ${request.url}`);
    }
    return authorized;
  }

  matchRoles(roles: string[], role: string) {
    return roles.indexOf(role) !== -1;
  }
}
