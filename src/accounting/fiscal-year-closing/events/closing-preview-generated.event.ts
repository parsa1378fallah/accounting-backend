export class ClosingPreviewGeneratedEvent {
    constructor(
        public readonly organizationId: string,
        public readonly fiscalYearId: string,
        public readonly generatedById: string,
        public readonly generatedAt: Date,
    ) { }
}