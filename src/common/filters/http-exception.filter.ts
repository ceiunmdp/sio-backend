import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

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

    response.status(status).json({
      statusCode: status,
      error,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
