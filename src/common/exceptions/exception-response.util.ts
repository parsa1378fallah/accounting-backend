import { ExceptionResponse } from './exception-response.interface';

export class ExceptionResponseUtil {
    static build(params: {
        statusCode: number;
        message: string;
        path: string;
        method: string;
        errors?: string[];
    }): ExceptionResponse {
        return {
            success: false,
            statusCode: params.statusCode,
            message: params.message,
            errors: params.errors,
            path: params.path,
            method: params.method,
            timestamp: new Date().toISOString(),
        };
    }
}