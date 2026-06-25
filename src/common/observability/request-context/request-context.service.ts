import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

import { RequestContext } from './request-context.interface';

@Injectable()
export class RequestContextService {
    private readonly storage =
        new AsyncLocalStorage<RequestContext>();

    run(
        context: RequestContext,
        callback: () => void,
    ) {
        this.storage.run(context, callback);
    }

    getContext(): RequestContext | undefined {
        return this.storage.getStore();
    }

    getRequestId(): string | undefined {
        return this.getContext()?.requestId;
    }

    getUserId(): string | undefined {
        return this.getContext()?.userId;
    }

    getOrganizationId(): string | undefined {
        return this.getContext()?.organizationId;
    }

    getBranchId(): string | undefined {
        return this.getContext()?.branchId;
    }

    getIp(): string | undefined {
        return this.getContext()?.ip;
    }

    getUserAgent(): string | undefined {
        return this.getContext()?.userAgent;
    }

    setUserId(userId: string) {
        const context = this.getContext();

        if (context) {
            context.userId = userId;
        }
    }

    setOrganizationId(orgId: string) {
        const context = this.getContext();

        if (context) {
            context.organizationId = orgId;
        }
    }

    setBranchId(branchId: string) {
        const context = this.getContext();

        if (context) {
            context.branchId = branchId;
        }
    }
}