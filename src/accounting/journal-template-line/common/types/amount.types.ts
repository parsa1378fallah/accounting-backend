import { Decimal } from 'decimal.js';
import { TemplateAmountType } from '../enums/template-amount-type.enum';

export interface AmountInput {
    type: TemplateAmountType;
    amount?: Decimal;
    percentage?: Decimal;
    formula?: string;
}

export interface AmountDistribution {
    lineId: string;
    amount: Decimal;
    percentage?: Decimal;
    formula?: string;
}

export interface RoundingConfig {
    mode: 'ROUND_UP' | 'ROUND_DOWN' | 'ROUND_HALF_UP' | 'ROUND_HALF_DOWN';
    precision: number;
}