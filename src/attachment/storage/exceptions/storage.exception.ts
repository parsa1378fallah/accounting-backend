import { InternalServerErrorException } from '@nestjs/common';

export enum StorageErrorCode {

    UNKNOWN = 'STORAGE_UNKNOWN',

    FILE_NOT_FOUND = 'STORAGE_FILE_NOT_FOUND',

    FILE_ALREADY_EXISTS = 'STORAGE_FILE_ALREADY_EXISTS',

    FILE_READ_FAILED = 'STORAGE_FILE_READ_FAILED',

    FILE_WRITE_FAILED = 'STORAGE_FILE_WRITE_FAILED',

    FILE_DELETE_FAILED = 'STORAGE_FILE_DELETE_FAILED',

    FILE_MOVE_FAILED = 'STORAGE_FILE_MOVE_FAILED',

    FILE_COPY_FAILED = 'STORAGE_FILE_COPY_FAILED',

    DIRECTORY_CREATE_FAILED = 'STORAGE_DIRECTORY_CREATE_FAILED',

    DIRECTORY_DELETE_FAILED = 'STORAGE_DIRECTORY_DELETE_FAILED',

    DIRECTORY_LIST_FAILED = 'STORAGE_DIRECTORY_LIST_FAILED',

    STREAM_FAILED = 'STORAGE_STREAM_FAILED',

    PERMISSION_DENIED = 'STORAGE_PERMISSION_DENIED',

    INVALID_CONFIGURATION = 'STORAGE_INVALID_CONFIGURATION',

    PROVIDER_NOT_AVAILABLE = 'STORAGE_PROVIDER_NOT_AVAILABLE',

    CONNECTION_FAILED = 'STORAGE_CONNECTION_FAILED',

}

export interface StorageExceptionOptions {

    code: StorageErrorCode;

    message: string;

    provider?: string;

    path?: string;

    cause?: unknown;

    metadata?: Record<string, unknown>;

}

export class StorageException
    extends InternalServerErrorException {

    constructor(
        options: StorageExceptionOptions,
    ) {

        super({

            statusCode: 500,

            error: 'Storage Error',

            code: options.code,

            message: options.message,

            provider: options.provider,

            path: options.path,

            metadata: options.metadata,

        });

        if (options.cause) {

            (this as any).cause =
                options.cause;

        }

    }

}