import { Decimal } from 'decimal.js';
import { CalculationResult } from '../types/calculation.types';

export class CalculationHelper {
    static calculateTotalDebit(results: CalculationResult[]): Decimal {
        return results
            .filter(r => r.isDebit)
            .reduce((sum, r) => sum.plus(r.amount), new Decimal(0));
    }

    static calculateTotalCredit(results: CalculationResult[]): Decimal {
        return results
            .filter(r => !r.isDebit)
            .reduce((sum, r) => sum.plus(r.amount), new Decimal(0));
    }

    static isBalanced(results: CalculationResult[]): boolean {
        const totalDebit = this.calculateTotalDebit(results);
        const totalCredit = this.calculateTotalCredit(results);
        return totalDebit.equals(totalCredit);
    }

    static getImbalanceAmount(results: CalculationResult[]): Decimal {
        const totalDebit = this.calculateTotalDebit(results);
        const totalCredit = this.calculateTotalCredit(results);
        return totalDebit.minus(totalCredit).abs();
    }

    static sortByDebitCredit(
        results: CalculationResult[],
    ): {
        debits: CalculationResult[];
        credits: CalculationResult[];
    } {
        return {
            debits: results.filter(r => r.isDebit),
            credits: results.filter(r => !r.isDebit),
        };
    }

    static groupByLineId(
        results: CalculationResult[],
    ): Map<string, CalculationResult> {
        const map = new Map<string, CalculationResult>();
        results.forEach(r => map.set(r.lineId, r));
        return map;
    }

    static validateCalculationResults(
        results: CalculationResult[],
    ): {
        valid: boolean;
        errors: string[];
    } {
        const errors: string[] = [];

        if (!Array.isArray(results)) {
            errors.push('Results must be an array');
        }

        results.forEach((result, index) => {
            if (!result.lineId) {
                errors.push(`Result at index ${index} missing lineId`);
            }

            if (!(result.amount instanceof Decimal)) {
                errors.push(`Result at index ${index} amount is not Decimal`);
            }

            if (typeof result.isDebit !== 'boolean') {
                errors.push(`Result at index ${index} isDebit is not boolean`);
            }
        });

        return {
            valid: errors.length === 0,
            errors,
        };
    }
}