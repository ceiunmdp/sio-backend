import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { MulterError } from 'multer';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CustomLoggerService } from 'src/logger/custom-logger.service';
import { QueryFailedError } from 'typeorm';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  constructor(private readonly logger: CustomLoggerService) {
    this.logger.context = ErrorsInterceptor.name;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(catchError((err) => throwError(this.buildHttpException(err))));
  }

  buildHttpException(err: Error) {
    if (err instanceof HttpException) {
      return this.handleHttpException(err);
    } else if (err instanceof TimeoutError) {
      return this.handleTimeoutError(err);
    } else if (err instanceof EntityNotFoundError) {
      return this.handleEntityNotFoundError(err);
    } else if (err instanceof MulterError) {
      return this.handleMulterError(err);
    } else if (err instanceof QueryFailedError) {
      return this.handleQueryFailedError(err);
    } else {
      return this.handleError(err);
    }
  }

  logError(status: number, { name, message, stack }: Error) {
    if (status >= 500) {
      this.logger.error(`\nHttpStatus: ${status}\nName: ${name}\nMessage: ${message}\nStack: ${stack}`);
    }
  }

  handleHttpException(err: HttpException) {
    this.logError(err.getStatus(), err);
    return err;
  }

  handleTimeoutError(err: TimeoutError) {
    this.logError(HttpStatus.INTERNAL_SERVER_ERROR, err);
    return new InternalServerErrorException({ error: 'Internal Server Error', message: 'Server Timeout' });
  }

  handleEntityNotFoundError(err: EntityNotFoundError) {
    this.logError(HttpStatus.NOT_FOUND, err);
    return new NotFoundException({ error: err.name, message: err.message });
  }

  handleMulterError(err: MulterError) {
    this.logError(HttpStatus.BAD_REQUEST, err);
    let message;
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'Archivo demasiado grande. Solo es posible subir archivos hasta 100 MB';
    } else {
      message = 'Evaluate rest of cases';
    }
    return new BadRequestException({ error: err.name, message });
  }

  handleQueryFailedError(err: QueryFailedError) {
    this.logError(HttpStatus.INTERNAL_SERVER_ERROR, err);
    return new InternalServerErrorException({ error: 'Internal Server Error', message: 'Internal Server Error' });
  }

  handleError(err: Error) {
    this.logError(HttpStatus.INTERNAL_SERVER_ERROR, err);
    return new InternalServerErrorException({
      error: 'Internal Server Error',
      message: 'Unexpected Error. Please add handler in ErrorsInterceptor',
    });
  }
}
