export class CalculationErrorException extends Error {
    constructor(
        public readonly message: string,
        public readonly formula?: string,
        public readonly variables?: Record<string, any>,
    ) {
        super(message);
    }
}

export class DebitCreditImbalanceException extends Error {
    constructor(
        public readonly totalDebit: any,
        public readonly totalCredit: any,
    ) {
        super(
            `Debit-credit imbalance. Debit: ${totalDebit}, Credit: ${totalCredit}`,
        );
    }
}

export class CalculationTimeoutException extends Error {
    constructor(timeoutMs: number) {
        super(`Calculation timeout exceeded: ${timeoutMs}ms`);
    }
}