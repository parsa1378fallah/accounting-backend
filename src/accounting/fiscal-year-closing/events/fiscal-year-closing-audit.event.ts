export class FiscalYearClosingAuditEvent {
    constructor(
        public readonly organizationId: string,
        public readonly fiscalYearId: string,
        public readonly action: string,
        public readonly userId: string,
        public readonly occurredAt: Date = new Date(),
        public readonly metadata?: Record<string, unknown>,
    ) { }
}