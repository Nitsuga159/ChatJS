import { Injectable, NestInterceptor, ExecutionContext, CallHandler, BadGatewayException } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((result) => {
        // Modify the response data here
        return { 
          statusCode: context.switchToHttp().getResponse().statusCode,
          result,
        };
      }),
      catchError((error) => {
        throw error
      }),
    );
  }
}
