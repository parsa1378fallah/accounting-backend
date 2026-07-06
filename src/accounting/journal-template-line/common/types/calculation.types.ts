import { Decimal } from 'decimal.js';
import { DebitCreditType } from '../enums/debit-credit-type.enum';

export interface CalculationContext {
    templateId: string;
    organizationId: string;
    variables: Record<string, Decimal | number>;
    currencyId?: string;
    currencyPrecision?: number;
    exchangeRate?: Decimal;
    calculationDate: Date;
}

export interface CalculationResult {
    lineId: string;
    amount: Decimal;
    isDebit: boolean;
    formula?: string;
    variables?: Record<string, Decimal>;
    calculatedAt: Date;
}

export interface CalculationPreview {
    results: CalculationResult[];
    totalDebit: Decimal;
    totalCredit: Decimal;
    isBalanced: boolean;
    calculationTime: number;
}