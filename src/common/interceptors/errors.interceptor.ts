import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(catchError((err) => throwError(this.buildHttpException(err))));
  }

  buildHttpException(err: Error) {
    if (err instanceof HttpException) {
      return err;
    } else if (err instanceof TimeoutError) {
      return new HttpException(
        { error: 'Internal Server Error', message: 'Server Timeout' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } else if (err instanceof EntityNotFoundError) {
      return new HttpException({ error: err.name, message: err.message }, HttpStatus.NOT_FOUND);
    } else {
      // Default
      return new HttpException(
        { error: 'Internal Server Error', message: 'Unexpected Error. Please add handler in ErrorsInterceptor' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
