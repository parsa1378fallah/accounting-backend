import { HttpException } from '@nestjs/common';

export class HttpExceptionHandler {
    static handle(exception: HttpException) {
        const response = exception.getResponse();

        let message = 'Request failed';
        let errors: string[] | undefined;

        if (typeof response === 'string') {
            message = response;
        }

        if (typeof response === 'object' && response !== null) {
            const res = response as any;

            if (Array.isArray(res.message)) {
                message = 'Validation failed';
                errors = res.message;
            } else if (res.message) {
                message = res.message;
            }
        }

        return {
            statusCode: exception.getStatus(),
            message,
            errors,
        };
    }
}