import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Namespace } from 'socket.io';
import { CustomLoggerService } from 'src/global/custom-logger.service';
import { UserRole } from '../enums/user-role.enum';
import { SocketWithUserData } from '../interfaces/socket-with-user-data.interface';
import { UserIdentity } from '../interfaces/user-identity.interface';
import { isHttp } from '../utils/is-application-context-functions';

@Injectable()
export class AuthZGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly logger: CustomLoggerService) {
    this.logger.context = AuthZGuard.name;
  }

  canActivate(context: ExecutionContext) {
    const authorizedRoles = this.reflector.get('roles', context.getHandler()) as UserRole[];

    if (!authorizedRoles) {
      return true;
    }

    let request: Request;
    let nsp: Namespace;
    let user: UserIdentity;

    if (isHttp(context)) {
      request = context.switchToHttp().getRequest<Request>();
      user = request.user as UserIdentity;
    } else {
      //* WS
      const client = context.switchToWs().getClient<SocketWithUserData>();
      user = client.user;
      nsp = client.nsp;
    }

    const authorized = this.checkIfRoleIsAuthorized(authorizedRoles, user.role);
    if (!authorized) {
      isHttp(context) ? this.logHttpError(user, request) : this.logWsError(user, nsp);
    }

    return authorized;
  }

  private checkIfRoleIsAuthorized(authorizedRoles: UserRole[], role: UserRole) {
    return authorizedRoles.includes(role);
  }

  private logHttpError(user: UserIdentity, request: Request) {
    this.logger.warn(`User ${user.id} tried to access ${request.method} ${request.url}`);
  }

  private logWsError(user: UserIdentity, nsp: Namespace) {
    this.logger.warn(`User ${user.id} tried to access namespace ${nsp.name}, path ${nsp.server.path()}`);
  }
}
