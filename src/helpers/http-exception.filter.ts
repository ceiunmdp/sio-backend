import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

        let message;
        if (exception instanceof HttpException) {
            const response: any = exception.getResponse();
            if (typeof response == 'string') {
                message = response;
            } else {
                // Pipe validation exception
                message = response.message;
            }
        } else {
            message = 'Internal Server Error';
        }

        response.status(status).json({
            statusCode: status,
            message: message,
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
}
