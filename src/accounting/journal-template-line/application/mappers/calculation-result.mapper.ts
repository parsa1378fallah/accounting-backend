import { Decimal } from 'decimal.js';
import { CalculationResult, CalculationPreview } from '../../common/types/calculation.types';
import { AmountCalculation } from '../../domain/entities/amount-calculation.entity';

export interface CalculationResultResponseDto {
    lineId: string;
    amount: string;
    isDebit: boolean;
    formula?: string;
    variables?: Record<string, string>;
    calculatedAt: Date;
}

export interface CalculationPreviewResponseDto {
    results: CalculationResultResponseDto[];
    totalDebit: string;
    totalCredit: string;
    isBalanced: boolean;
    calculationTime: number;
}

export class CalculationResultMapper {
    static toResponse(
        result: CalculationResult,
    ): CalculationResultResponseDto {
        return {
            lineId: result.lineId,
            amount: result.amount.toString(),
            isDebit: result.isDebit,
            formula: result.formula,
            variables: result.variables
                ? Object.fromEntries(
                    Object.entries(result.variables).map(([k, v]) => [
                        k,
                        v.toString(),
                    ]),
                )
                : undefined,
            calculatedAt: result.calculatedAt,
        };
    }

    static toResponses(
        results: CalculationResult[],
    ): CalculationResultResponseDto[] {
        return results.map(r => this.toResponse(r));
    }

    static toPreviewResponse(
        preview: CalculationPreview,
    ): CalculationPreviewResponseDto {
        return {
            results: this.toResponses(preview.results),
            totalDebit: preview.totalDebit.toString(),
            totalCredit: preview.totalCredit.toString(),
            isBalanced: preview.isBalanced,
            calculationTime: preview.calculationTime,
        };
    }

    static fromAmountCalculation(
        calc: AmountCalculation,
    ): CalculationResult {
        return {
            lineId: calc.lineId,
            amount: calc.amount,
            isDebit: calc.isDebit,
            formula: calc.formula,
            variables: calc.variables,
            calculatedAt: calc.calculatedAt,
        };
    }

    static fromAmountCalculations(
        calcs: AmountCalculation[],
    ): CalculationResult[] {
        return calcs.map(c => this.fromAmountCalculation(c));
    }
}