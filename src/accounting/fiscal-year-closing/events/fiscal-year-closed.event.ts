export class FiscalYearClosedEvent {
    constructor(
        public readonly organizationId: string,
        public readonly fiscalYearId: string,
        public readonly closingId: string,
        public readonly closingJournalEntryId: string,
        public readonly retainedEarningsAmount: string,
        public readonly closedById: string,
        public readonly closedAt: Date,
    ) { }
}