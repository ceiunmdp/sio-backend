import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { CustomLoggerService } from 'src/logger/custom-logger.service';
import { UserIdentity } from '../interfaces/user-identity.interface';

@Injectable()
export class AuthZGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly logger: CustomLoggerService) {
    this.logger.context = AuthZGuard.name;
  }

  canActivate(context: ExecutionContext): boolean {
    const authorizedRoles = this.reflector.get('roles', context.getHandler()) as string[];

    if (!authorizedRoles) {
      return true;
    }
    const request: Request = context.switchToHttp().getRequest();
    const user = request.user as UserIdentity;

    const authorized = this.checkIfRoleIsAuthorized(authorizedRoles, user.role);

    if (!authorized) {
      this.logger.warn(`User ${user.id} tried to access ${request.method} ${request.url}`);
    }
    return authorized;
  }

  checkIfRoleIsAuthorized(authorizedRoles: string[], role: string) {
    return authorizedRoles.includes(role);
  }
}
