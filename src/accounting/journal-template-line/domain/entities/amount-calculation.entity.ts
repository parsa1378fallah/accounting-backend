import { Decimal } from 'decimal.js';
import { CalculationResult } from '../../common/types/calculation.types';

export class AmountCalculation {
    constructor(
        public readonly lineId: string,
        public readonly amount: Decimal,
        public readonly isDebit: boolean,
        public readonly formula?: string,
        public readonly variables?: Record<string, Decimal>,
        public readonly calculatedAt: Date = new Date(),
    ) { }

    toCalculationResult(): CalculationResult {
        return {
            lineId: this.lineId,
            amount: this.amount,
            isDebit: this.isDebit,
            formula: this.formula,
            variables: this.variables,
            calculatedAt: this.calculatedAt,
        };
    }

    toJSON() {
        return {
            lineId: this.lineId,
            amount: this.amount.toString(),
            isDebit: this.isDebit,
            formula: this.formula,
            variables: this.variables ? Object.fromEntries(
                Object.entries(this.variables).map(([k, v]) => [k, v.toString()])
            ) : undefined,
            calculatedAt: this.calculatedAt,
        };
    }
}