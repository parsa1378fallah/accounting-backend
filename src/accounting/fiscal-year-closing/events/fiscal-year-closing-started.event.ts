export class FiscalYearClosingStartedEvent {
    constructor(
        public readonly organizationId: string,
        public readonly fiscalYearId: string,
        public readonly startedById: string,
        public readonly startedAt: Date = new Date(),
    ) { }
}