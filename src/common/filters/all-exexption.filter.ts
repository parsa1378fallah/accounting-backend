import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';

import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';

import { ExceptionResponseUtil } from '../exceptions/exception-response.util';
import { HttpExceptionHandler } from '../exceptions/http-exception.handler';
import { PrismaExceptionHandler } from '../exceptions/prisma-exception.handler';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();

        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();

        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let errors: string[] | undefined;

        if (exception instanceof HttpException) {
            const result = HttpExceptionHandler.handle(exception);

            statusCode = result.statusCode;
            message = result.message;
            errors = result.errors;
        } else if (
            exception instanceof Prisma.PrismaClientKnownRequestError
        ) {
            const result =
                PrismaExceptionHandler.handle(exception);

            statusCode = result.statusCode;
            message = result.message;
        }

        this.logger.error(
            `${request.method} ${request.originalUrl}`,
            exception instanceof Error ? exception.stack : undefined,
        );

        response.status(statusCode).json(
            ExceptionResponseUtil.build({
                statusCode,
                message,
                errors,
                path: request.originalUrl,
                method: request.method,
            }),
        );
    }
}