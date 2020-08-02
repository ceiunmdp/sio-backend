import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { QueryFailedError } from 'typeorm';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ErrorsInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(catchError((err) => throwError(this.buildHttpException(err))));
  }

  buildHttpException(err: Error) {
    if (err instanceof HttpException) {
      this.logError(err.getStatus(), err);
      return err;
    } else if (err instanceof TimeoutError) {
      this.logError(HttpStatus.INTERNAL_SERVER_ERROR, err);
      return new HttpException(
        { error: 'Internal Server Error', message: 'Server Timeout' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } else if (err instanceof EntityNotFoundError) {
      this.logError(HttpStatus.NOT_FOUND, err);
      return new HttpException({ error: err.name, message: err.message }, HttpStatus.NOT_FOUND);
    } else if (err instanceof QueryFailedError) {
      this.logError(HttpStatus.INTERNAL_SERVER_ERROR, err);
      return new HttpException(
        { error: 'Internal Server Error', message: 'Internal Server Error' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } else {
      // Default
      return new HttpException(
        { error: 'Internal Server Error', message: 'Unexpected Error. Please add handler in ErrorsInterceptor' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  logError(status: number, { name, message, stack }: Error) {
    if (status >= 500) {
      this.logger.error(`\nHttpStatus: ${status}\nName: ${name}\nMessage: ${message}\nStack: ${stack}`);
    }
  }
}
