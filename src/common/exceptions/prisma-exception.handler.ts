import { Prisma } from '@prisma/client';
import { HttpStatus } from '@nestjs/common';

export class PrismaExceptionHandler {
    static isPrisma(exception: unknown): boolean {
        return exception instanceof Prisma.PrismaClientKnownRequestError;
    }

    static handle(
        exception: Prisma.PrismaClientKnownRequestError,
    ) {
        switch (exception.code) {
            case 'P2002':
                return {
                    statusCode: HttpStatus.CONFLICT,
                    message: 'Resource already exists.',
                };

            case 'P2025':
                return {
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Resource not found.',
                };

            case 'P2003':
                return {
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: 'Operation violates database constraints.',
                };

            default:
                return {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Database error.',
                };
        }
    }
}