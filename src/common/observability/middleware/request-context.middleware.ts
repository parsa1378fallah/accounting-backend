import {
    Injectable,
    NestMiddleware,
} from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

import { RequestContextService } from '../request-context/request-context.service';

@Injectable()
export class RequestContextMiddleware
    implements NestMiddleware {
    constructor(
        private readonly requestContext: RequestContextService,
    ) { }

    use(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        const requestId =
            (req.headers['x-request-id'] as string) ??
            randomUUID();

        const context = {
            requestId,

            ip:
                req.ip ||
                req.socket.remoteAddress ||
                undefined,

            userAgent: req.get('user-agent'),

            userId: undefined,

            organizationId: undefined,

            branchId: undefined,
        };

        this.requestContext.run(context, () => {
            next();
        });
    }
}