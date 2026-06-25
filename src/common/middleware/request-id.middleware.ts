import {
    Injectable,
    NestMiddleware,
} from '@nestjs/common';

import { randomUUID } from 'crypto';

import { NextFunction, Request, Response } from 'express';

import {
    REQUEST_ID_HEADER,
    REQUEST_START_TIME,
} from '../constants/request.constants';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {

    use(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        const requestId =
            req.header(REQUEST_ID_HEADER) ??
            randomUUID();

        req.headers[REQUEST_ID_HEADER] = requestId;

        (req as any)[REQUEST_START_TIME] =
            Date.now();

        res.setHeader(
            REQUEST_ID_HEADER,
            requestId,
        );

        next();
    }
}