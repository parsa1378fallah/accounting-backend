export interface RequestContext {

    requestId: string;

    userId?: string;

    organizationId?: string;

    branchId?: string;

    ip?: string;

    userAgent?: string;

}