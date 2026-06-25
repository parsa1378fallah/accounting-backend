import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

import { Logger } from 'winston';

import { RequestContextService } from '../request-context/request-context.service';

export interface LogMeta {
    context?: string;
    data?: unknown;
}

@Injectable()
export class LoggerService {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER)
        private readonly logger: Logger,

        private readonly requestContext: RequestContextService,
    ) { }

    log(
        message: string,
        meta?: LogMeta,
    ) {
        this.logger.info(message, {
            context: meta?.context,
            requestId: this.requestContext.getRequestId?.(),
            userId: this.requestContext.getUserId?.(),
            organizationId:
                this.requestContext.getOrganizationId?.(),
            data: meta?.data,
        });
    }

    warn(
        message: string,
        meta?: LogMeta,
    ) {
        this.logger.warn(message, {
            context: meta?.context,
            requestId: this.requestContext.getRequestId?.(),
            userId: this.requestContext.getUserId?.(),
            organizationId:
                this.requestContext.getOrganizationId?.(),
            data: meta?.data,
        });
    }

    debug(
        message: string,
        meta?: LogMeta,
    ) {
        this.logger.debug(message, {
            context: meta?.context,
            requestId: this.requestContext.getRequestId?.(),
            userId: this.requestContext.getUserId?.(),
            organizationId:
                this.requestContext.getOrganizationId?.(),
            data: meta?.data,
        });
    }

    error(
        message: string,
        error?: unknown,
        meta?: LogMeta,
    ) {
        this.logger.error(message, {
            context: meta?.context,
            requestId: this.requestContext.getRequestId?.(),
            userId: this.requestContext.getUserId?.(),
            organizationId:
                this.requestContext.getOrganizationId?.(),
            data: meta?.data,
            error,
        });
    }
}