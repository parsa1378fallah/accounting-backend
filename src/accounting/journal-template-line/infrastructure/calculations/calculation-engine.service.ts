import { Injectable, Logger } from '@nestjs/common';
import { Decimal } from 'decimal.js';
import { FormulaEvaluatorService } from './formula-evaluator.service';
import { CalculationContext } from '../../domain/entities/calculation-context.entity';
import { JournalTemplateLine } from '../../domain/entities/journal-template-line.entity';
import { AmountCalculation } from '../../domain/entities/amount-calculation.entity';
import { CalculationResult, CalculationPreview } from '../../common/types/calculation.types';

@Injectable()
export class CalculationEngineService {
    private readonly logger = new Logger(CalculationEngineService.name);

    constructor(
        private readonly evaluator: FormulaEvaluatorService,
    ) { }

    async calculatePreview(
        lines: JournalTemplateLine[],
        context: CalculationContext,
    ): Promise<CalculationPreview> {
        const startTime = Date.now();

        this.logger.debug(`Starting calculation preview for ${lines.length} lines`);

        try {
            const results: CalculationResult[] = [];
            let totalDebit = new Decimal(0);
            let totalCredit = new Decimal(0);

            for (const line of lines) {
                if (line.isDeleted()) {
                    continue;
                }

                const amountType = line.getAmountType();
                let amount: Decimal;

                if (amountType.isFixed()) {
                    amount = line.getAmount()?.value || new Decimal(0);
                } else if (amountType.isPercentage()) {
                    const baseAmount = context.getVariable('baseAmount');
                    const percentage = line.getPercentage() || new Decimal(0);

                    amount = new Decimal(baseAmount || 0)
                        .times(percentage)
                        .dividedBy(100);
                } else if (amountType.isFormula()) {
                    const formula = line.getFormula();
                    if (!formula) {
                        throw new Error(`Formula is missing for line ${line.getId().value}`);
                    }

                    amount = await this.evaluator.evaluate(
                        formula.expression,
                        context.variables,
                    );
                } else {
                    throw new Error(`Unknown amount type: ${amountType}`);
                }

                // تقریب
                amount = amount.toDecimalPlaces(context.currencyPrecision);

                const result: CalculationResult = {
                    lineId: line.getId().value,
                    amount,
                    isDebit: line.isDebitEntry(),
                    formula: line.getFormula()?.expression,
                    variables: context.variables as Record<string, Decimal>,
                    calculatedAt: new Date(),
                };

                results.push(result);

                if (line.isDebitEntry()) {
                    totalDebit = totalDebit.plus(amount);
                } else {
                    totalCredit = totalCredit.plus(amount);
                }
            }

            const executionTime = Date.now() - startTime;

            return {
                results,
                totalDebit,
                totalCredit,
                isBalanced: totalDebit.equals(totalCredit),
                calculationTime: executionTime,
            };
        } catch (error) {
            this.logger.error(`Calculation preview failed: ${error.message}`);
            throw error;
        }
    }
}