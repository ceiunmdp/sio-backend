import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CustomLoggerService } from 'src/logger/custom-logger.service';
import { Request } from 'express';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(private readonly logger: CustomLoggerService) {
    this.logger.context = LoggerInterceptor.name;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest<Request>();
    this.logger.log(`${request.method} ${request.path}`);
    return next.handle().pipe(tap(() => this.logger.log(`Request took ${Date.now() - now}ms`)));
  }
}
