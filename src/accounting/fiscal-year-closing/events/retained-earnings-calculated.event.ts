export class RetainedEarningsCalculatedEvent {
    constructor(
        public readonly organizationId: string,
        public readonly fiscalYearId: string,
        public readonly totalRevenue: string,
        public readonly totalExpense: string,
        public readonly netIncome: string,
        public readonly retainedEarnings: string,
    ) { }
}