import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express'; // ✅ Import Request
import logger from '../logging/logger';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        if ('message' in exceptionResponse) {
          message = Array.isArray((exceptionResponse as any).message)
            ? (exceptionResponse as any).message.join(', ')
            : (exceptionResponse as any).message;
        }
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    logger.error(
      `Exception - Status: ${status}, Method: ${request.method}, Path: ${request.url}, Message: ${message}`,
      {
        stack: exception instanceof Error ? exception.stack : undefined,
        path: request.url,
        method: request.method,
      },
    );

    response.status(status).json({
      status: 'failed',
      message,
      data: null,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
