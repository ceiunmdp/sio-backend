import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Request, Response } from 'express';
import { CustomError } from '../classes/custom-error.class';
import { ErrorObject } from '../interfaces/error-object.interface';
import { InternalErrorWs } from '../interfaces/internal-error-ws.interface';
import { InternalError } from '../interfaces/internal-error.interface';
import { SocketWithUserData } from '../interfaces/socket-with-user-data.interface';
import { isHttp as isHttpFunction } from '../utils/is-application-context-functions';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const isHttp = isHttpFunction(host);

    const [error, message] = this.getErrorAndMessage(exception);

    if (isHttp) {
      const context = host.switchToHttp();
      const request = context.getRequest<Request>();
      const response = context.getResponse<Response>();
      const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

      response.status(status).json(this.buildHttpError(request, { status, error, message }));
    } else {
      //* WS
      const client = host.switchToWs().getClient<SocketWithUserData>();
      throw new WsException(this.buildWsError(client, { error, message }));
    }
  }

  private getErrorAndMessage(exception: Error) {
    if (exception instanceof HttpException) {
      return this.getErrorAndMessageProperties(exception.getResponse());
    } else {
      //* WsException
      const wsException = exception as WsException;
      return this.getErrorAndMessageProperties(wsException.getError());
    }
  }

  private getErrorAndMessageProperties(objectOrError: string | unknown) {
    if (typeof objectOrError === 'string') {
      return [objectOrError, objectOrError];
    } else {
      const error = objectOrError as ErrorObject;
      return [error.error, error.message];
    }
  }

  buildHttpError(request: Request, { status, error, message }: InternalError) {
    return new CustomError({
      status_code: status,
      error,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private buildWsError(client: SocketWithUserData, { error, message }: InternalErrorWs) {
    return new CustomError({
      error,
      message,
      timestamp: new Date().toISOString(),
      path: client.nsp.server.path(),
    });
  }
}
