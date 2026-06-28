export class FxGainLossUnrealizedEvent {
    constructor(
        public readonly id: string,
        public readonly journalEntryId: string,
        public readonly amount: number,
    ) { }
}