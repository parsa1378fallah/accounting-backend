import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor<T>
    implements NestInterceptor<T, any> {
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<any> {
        return next.handle().pipe(
            map((response) => {
                if (
                    response &&
                    typeof response === 'object' &&
                    'data' in response &&
                    'meta' in response
                ) {
                    return {
                        success: true,
                        timestamp: new Date().toISOString(),
                        ...response,
                    };
                }

                return {
                    success: true,
                    timestamp: new Date().toISOString(),
                    data: response,
                };
            }),
        );
    }
}