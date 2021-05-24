import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { MulterError } from 'multer';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CustomLoggerService } from 'src/global/custom-logger.service';
import { QueryFailedError } from 'typeorm';
import { isHttp } from '../utils/is-application-context-functions';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  constructor(private readonly logger: CustomLoggerService) {
    this.logger.context = ErrorsInterceptor.name;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(catchError((err) => throwError(this.buildException(err, isHttp(context)))));
  }

  private buildException(error: Error, isHttp: boolean) {
    if (error instanceof HttpException) {
      return this.handleHttpException(error);
    } else if (error instanceof WsException) {
      return this.handleWsException(error);
    } else if (error instanceof TimeoutError) {
      return this.handleTimeoutError(error, isHttp);
      // } else if (error instanceof EntityNotFoundError) {
      //   return this.handleEntityNotFoundError(error, isHttp);
    } else if (error instanceof MulterError) {
      return this.handleMulterError(error, isHttp);
    } else if (error instanceof QueryFailedError) {
      return this.handleQueryFailedError(error, isHttp);
    } else {
      return this.handleError(error, isHttp);
    }
  }

  private logError({ name, message, stack }: Error, status?: number) {
    if (status >= 500) {
      const httpStatusMessage = `\nHttpStatus: ${status}` || '';
      this.logger.error(`${httpStatusMessage}\nName: ${name}\nMessage: ${message}\nStack: ${stack}`);
    }
  }

  private buildError(name: string, message: string): Error {
    return { name, message };
  }

  private handleHttpException(error: HttpException) {
    this.logError(error, error.getStatus());
    return error;
  }

  private handleWsException(error: WsException) {
    this.logError(error);
    return error;
  }

  private handleTimeoutError(timeoutError: TimeoutError, isHttp: boolean) {
    this.logError(timeoutError, HttpStatus.INTERNAL_SERVER_ERROR);
    const error = this.buildError('Internal Server Error', 'Server Timeout');
    return isHttp ? new InternalServerErrorException(error) : new WsException(timeoutError);
  }

  private handleMulterError(multerError: MulterError, isHttp: boolean) {
    this.logError(multerError, HttpStatus.BAD_REQUEST);

    let message;
    if (multerError.code === 'LIMIT_FILE_SIZE') {
      message = 'Archivo demasiado grande. Solo es posible subir archivos hasta 100 MB.';
    } else {
      message = 'Evaluate rest of cases.';
    }

    const error = this.buildError(multerError.name, message);
    return isHttp ? new BadRequestException(error) : new WsException(error);
  }

  private handleQueryFailedError(queryFailedError: QueryFailedError, isHttp: boolean) {
    this.logError(queryFailedError, HttpStatus.INTERNAL_SERVER_ERROR);
    const error = this.buildError('Internal Server Error', 'Internal Server Error');
    return isHttp ? new InternalServerErrorException(error) : new WsException(error);
  }

  private handleError(error: Error, isHttp: boolean) {
    this.logError(error, HttpStatus.INTERNAL_SERVER_ERROR);
    const err = this.buildError('Internal Server Error', 'Unexpected Error. Please add handler in ErrorsInterceptor.');
    return isHttp ? new InternalServerErrorException(err) : new WsException(err);
  }
}
