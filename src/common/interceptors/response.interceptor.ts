import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((response) => {
        if (!response || typeof response !== 'object') {
          return { status: 'success', message: 'success', data: null };
        }
        const { msg, ...data } = response;

        return {
          status: 'success',
          message: msg || 'success',
          data: Object.keys(data).length ? data : null,
        };
      }),
    );
  }
}
