import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CustomLoggerService } from 'src/global/custom-logger.service';
import { SocketWithUserData } from '../interfaces/socket-with-user-data.interface';
import { isHttp } from '../utils/is-application-context-functions';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(private readonly logger: CustomLoggerService) {
    this.logger.context = LoggerInterceptor.name;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = DateTime.local();

    if (isHttp(context)) {
      const request = context.switchToHttp().getRequest<Request>();
      this.logger.log(`${request.method} ${request.path}`);
    } else {
      //* WS
      const { nsp } = context.switchToWs().getClient<SocketWithUserData>();
      this.logger.log(`Namespace: ${nsp.name}, Path: ${nsp.server.path()}`);
    }

    return next
      .handle()
      .pipe(tap(() => this.logger.log(`Request took ${DateTime.local().diff(now, 'milliseconds').milliseconds}ms`)));
  }
}
