export class FiscalYearClosingFailedEvent {
    constructor(
        public readonly organizationId: string,
        public readonly fiscalYearId: string,
        public readonly userId: string,
        public readonly reason: string,
        public readonly failedAt: Date = new Date(),
    ) { }
}