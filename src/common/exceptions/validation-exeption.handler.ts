import { BadRequestException } from '@nestjs/common';

export class ValidationExceptionHandler {
    static isValidation(exception: unknown): boolean {
        if (!(exception instanceof BadRequestException)) {
            return false;
        }

        const response = exception.getResponse();

        return (
            typeof response === 'object' &&
            response !== null &&
            Array.isArray((response as any).message)
        );
    }
}