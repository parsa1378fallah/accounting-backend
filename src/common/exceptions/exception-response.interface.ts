export interface ExceptionResponse {
    success: false;
    statusCode: number;
    message: string;
    errors?: string[];
    path: string;
    method: string;
    timestamp: string;
}