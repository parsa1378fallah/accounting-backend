import { LogMeta } from './logger.types';

export interface ILogger {
    log(
        message: string,
        meta?: LogMeta,
    ): void;

    warn(
        message: string,
        meta?: LogMeta,
    ): void;

    debug(
        message: string,
        meta?: LogMeta,
    ): void;

    error(
        message: string,
        error?: unknown,
        meta?: LogMeta,
    ): void;
}