// src/modules/accounting/journal-template/events/recurring-journal.event.ts
export class RecurringJournalExecutedEvent {
    constructor(
        public readonly recurringJournalId: string,
        public readonly templateId: string,
        public readonly journalEntryId: string,
        public readonly journalNumber: string,
        public readonly executedAt: Date,
    ) { }
}

export class RecurringJournalFailedEvent {
    constructor(
        public readonly recurringJournalId: string,
        public readonly error: string,
        public readonly attempt: number,
    ) { }
}