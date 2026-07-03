export class ClosingJournalCreatedEvent {
    constructor(
        public readonly organizationId: string,
        public readonly fiscalYearId: string,
        public readonly journalEntryId: string,
    ) { }
}