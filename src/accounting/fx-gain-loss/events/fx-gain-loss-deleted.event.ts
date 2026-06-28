export class FxGainLossDeletedEvent {
    constructor(
        public readonly id: string,
        public readonly organizationId: string,
    ) { }
}