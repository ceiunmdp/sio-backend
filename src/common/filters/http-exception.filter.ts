import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { CustomLoggerService } from 'src/logger/custom-logger.service';

interface InternalError {
  status: number;
  error: string;
  message: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: CustomLoggerService) {
    this.logger.context = AllExceptionsFilter.name;
  }

  catch(exception: Error, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const request = context.getRequest<Request>();
    const response = context.getResponse<Response>();

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

    response.status(status).json(buildError(request, { status, error, message }));
  }
}

export function buildError(req: Request, { status, error, message }: InternalError) {
  return {
    statusCode: status,
    error,
    message,
    timestamp: new Date().toISOString(),
    path: req.url,
  };
}
