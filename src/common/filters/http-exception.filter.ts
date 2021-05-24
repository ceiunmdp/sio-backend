import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { CustomError } from '../classes/custom-error.class';
import { InternalError } from '../interfaces/internal-error.interface';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const [name, message] = this.getNameAndMessage(exception);

    const context = host.switchToHttp();
    const request = context.getRequest<Request>();
    const response = context.getResponse<Response>();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json(this.buildHttpError(request, { status, name, message }));
  }

  private getNameAndMessage(exception: HttpException) {
    return this.getNameAndMessageProperties(exception.getResponse());
  }

  private getNameAndMessageProperties(stringOrObject: string | unknown) {
    if (typeof stringOrObject === 'string') {
      const str = stringOrObject as string;
      return [str, str];
    } else {
      const { error, message } = stringOrObject as { error: string; message: string };
      return [error, message];
    }
  }

  buildHttpError(request: Request, { status, name, message }: InternalError) {
    return new CustomError({
      status_code: status,
      name,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
