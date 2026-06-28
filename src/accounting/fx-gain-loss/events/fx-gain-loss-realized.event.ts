export class FxGainLossRealizedEvent {
    constructor(
        public readonly id: string,
        public readonly journalEntryId: string,
        public readonly amount: number,
    ) { }
}