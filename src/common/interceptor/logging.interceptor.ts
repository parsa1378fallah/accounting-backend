import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';

import { Observable } from 'rxjs';

import { tap } from 'rxjs/operators';

import { Request } from 'express';

import { LoggerService } from '../observability/logger/logger.service';

import {
    REQUEST_ID_HEADER,
    REQUEST_START_TIME,
} from '../constants/request.constants';

@Injectable()
export class LoggingInterceptor
    implements NestInterceptor {
    constructor(
        private readonly logger: LoggerService,
    ) { }

    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<any> {
        const request =
            context.switchToHttp().getRequest<Request>();

        const method = request.method;

        const url = request.originalUrl;

        const requestId =
            request.headers[
            REQUEST_ID_HEADER
            ];

        return next.handle().pipe(
            tap(() => {
                const duration =
                    Date.now() -
                    (request as any)[
                    REQUEST_START_TIME
                    ];

                this.logger.log(
                    `[${requestId}] ${method} ${url} ${duration}ms`,
                    {
                        context: LoggingInterceptor.name,
                    },
                );
            }),
        );
    }
}