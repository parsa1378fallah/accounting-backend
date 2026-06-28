export class FxGainLossCreatedEvent {
    constructor(
        public readonly id: string,
        public readonly organizationId: string,
        public readonly journalEntryId: string,
    ) { }
}