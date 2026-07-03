export class FiscalYearReopenedEvent {
    constructor(
        public readonly organizationId: string,
        public readonly fiscalYearId: string,
        public readonly closingId: string,
        public readonly reopenedById: string,
        public readonly reopenedAt: Date,
    ) { }
}