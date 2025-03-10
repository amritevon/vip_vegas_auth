import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SuccessResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const response = http.getResponse();

    if (response.statusCode === 201) {
      response.status(200);
    }

    return next.handle().pipe(
      map((data) => ({
        // statusCode: response.statusCode,
        // success: true,
        ...data,
      })),
    );
  }
}
