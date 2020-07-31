import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    // console.log(exception);

    let error;
    let message;
    if (exception instanceof HttpException) {
      const response: any = exception.getResponse();
      if (typeof response === 'string') {
        error = response;
        message = response;
      } else {
        // Pipe validation exceptions
        error = response.error;
        message = response.message;
      }
    }
    // Not needed due to ErrorsInterceptor
    // else {
    //   status = HttpStatus.INTERNAL_SERVER_ERROR;
    //   error = 'Internal Server Error';
    //   message = 'Error del servidor';
    // }

    this.logError(status, exception);

    response.status(status).json({
      statusCode: status,
      error,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  logError(status: number, { name, message, stack }: Error) {
    if (status >= 500) {
      this.logger.error(`\nHttpStatus: ${status}\nName: ${name}\nMessage: ${message}\n Stack: ${stack}`);
    }
  }
}
