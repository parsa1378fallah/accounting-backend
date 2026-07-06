import { Injectable, Logger } from '@nestjs/common';
import { Decimal } from 'decimal.js';
import { JournalTemplateLine } from '../../domain/entities/journal-template-line.entity';
import { AmountCalculation } from '../../domain/entities/amount-calculation.entity';
import { CalculationContext } from '../../domain/entities/calculation-context.entity';
import { FormulaCalculatorService } from './formula-calculator.service';
import { RoundingStrategyService } from '../../infrastructure/calculations/rounding-strategy.service';
import { DebitCreditBalancePolicy } from '../../domain/policies/debit-credit-balance.policy';
import { InvalidAmountTypeException } from '../../common/exceptions/invalid-amount-type.exception';

@Injectable()
export class AmountCalculatorService {
    private readonly logger = new Logger(AmountCalculatorService.name);

    constructor(
        private readonly formulaCalculator: FormulaCalculatorService,
        private readonly roundingStrategy: RoundingStrategyService,
        private readonly balancePolicy: DebitCreditBalancePolicy,
    ) { }

    /**
     * محاسبه مبلغ برای یک خط
     */
    async calculateLine(
        line: JournalTemplateLine,
        context: CalculationContext,
    ): Promise<AmountCalculation> {
        this.logger.debug(
            `Calculating amount for line: ${line.getId().value}`,
        );

        try {
            let amount: Decimal;
            let formula: string | undefined;
            let variables: Record<string, Decimal> | undefined;

            const amountType = line.getAmountType();

            // نوع FIXED - مبلغ ثابت
            if (amountType.isFixed()) {
                amount = line.getAmount()?.value || new Decimal(0);
                this.logger.debug(`Line ${line.getId().value} is FIXED: ${amount}`);
            }
            // نوع PERCENTAGE - درصد
            else if (amountType.isPercentage()) {
                const percentage = line.getPercentage() || new Decimal(0);
                const baseAmount = context.getVariable('baseAmount');

                if (!baseAmount) {
                    throw new Error(
                        'baseAmount variable is required for percentage calculation',
                    );
                }

                // استفاده از روش‌های صحیح: times (به جای multipliedBy) و dividedBy
                amount = new Decimal(baseAmount)
                    .times(percentage)
                    .dividedBy(new Decimal(100));

                this.logger.debug(
                    `Line ${line.getId().value} is PERCENTAGE: ${percentage}% of ${baseAmount} = ${amount}`,
                );
            }
            // نوع FORMULA - فرمول
            else if (amountType.isFormula()) {
                const formulaObj = line.getFormula();

                if (!formulaObj) {
                    throw new InvalidAmountTypeException(amountType.value, [
                        'Formula is required',
                    ]);
                }

                amount = await this.formulaCalculator.calculate(
                    formulaObj,
                    context,
                );
                formula = formulaObj.expression;
                variables = context.variables as Record<string, Decimal>;

                this.logger.debug(
                    `Line ${line.getId().value} is FORMULA: ${formula} = ${amount}`,
                );
            }
            // نوع نامشخص
            else {
                throw new InvalidAmountTypeException(amountType.value);
            }

            // اعمال تقریب بر اساس دقت ارز
            amount = this.roundingStrategy.round(
                amount,
                context.currencyPrecision,
            );

            this.logger.debug(
                `Final amount for line ${line.getId().value}: ${amount}`,
            );

            return new AmountCalculation(
                line.getId().value,
                amount,
                line.isDebitEntry(),
                formula,
                variables,
            );
        } catch (error) {
            this.logger.error(
                `Error calculating amount for line ${line.getId().value}: ${error.message}`,
            );
            throw error;
        }
    }

    /**
     * محاسبه مبالغ برای چندین خط
     */
    async calculateLines(
        lines: JournalTemplateLine[],
        context: CalculationContext,
    ): Promise<AmountCalculation[]> {
        this.logger.debug(`Calculating amounts for ${lines.length} lines`);

        try {
            // فیلتر کردن خطوط حذف‌شده و محاسبه مبالغ
            const activeLines = lines.filter(l => !l.isDeleted());

            this.logger.debug(
                `Processing ${activeLines.length} active lines (${lines.length - activeLines.length} deleted lines ignored)`,
            );

            const calculations = await Promise.all(
                activeLines.map(line => this.calculateLine(line, context)),
            );

            this.logger.debug(
                `Successfully calculated amounts for ${calculations.length} lines`,
            );

            return calculations;
        } catch (error) {
            this.logger.error(
                `Error calculating lines: ${error.message}`,
            );
            throw error;
        }
    }

    /**
     * بررسی تعادل دبیتور-بستانکار
     */
    validateBalance(calculations: AmountCalculation[]): boolean {
        try {
            this.balancePolicy.validate(calculations);
            this.logger.debug('Balance validation passed');
            return true;
        } catch (error) {
            this.logger.warn(`Balance validation failed: ${error.message}`);
            return false;
        }
    }

    /**
     * محاسبه کل دبیتور و بستانکار
     */
    getBalance(calculations: AmountCalculation[]): {
        totalDebit: Decimal;
        totalCredit: Decimal;
        difference: Decimal;
        isBalanced: boolean;
    } {
        let totalDebit = new Decimal(0);
        let totalCredit = new Decimal(0);

        calculations.forEach(calc => {
            if (calc.isDebit) {
                totalDebit = totalDebit.plus(calc.amount);
            } else {
                totalCredit = totalCredit.plus(calc.amount);
            }
        });

        const difference = totalDebit.minus(totalCredit).abs();
        const isBalanced = totalDebit.equals(totalCredit);

        this.logger.debug(
            `Balance summary - Debit: ${totalDebit}, Credit: ${totalCredit}, Difference: ${difference}, Balanced: ${isBalanced}`,
        );

        return {
            totalDebit,
            totalCredit,
            difference,
            isBalanced,
        };
    }

    /**
     * محاسبه کل بدون تفصیل
     */
    getTotals(calculations: AmountCalculation[]): {
        totalDebit: Decimal;
        totalCredit: Decimal;
    } {
        let totalDebit = new Decimal(0);
        let totalCredit = new Decimal(0);

        calculations.forEach(calc => {
            if (calc.isDebit) {
                totalDebit = totalDebit.plus(calc.amount);
            } else {
                totalCredit = totalCredit.plus(calc.amount);
            }
        });

        return {
            totalDebit,
            totalCredit,
        };
    }

    /**
     * محاسبه میانگین مبالغ
     */
    getAverage(calculations: AmountCalculation[]): Decimal {
        if (calculations.length === 0) {
            return new Decimal(0);
        }

        const total = calculations
            .reduce((sum, calc) => sum.plus(calc.amount), new Decimal(0));

        return total.dividedBy(new Decimal(calculations.length));
    }

    /**
     * محاسبه حداکثر مبلغ
     */
    getMaxAmount(calculations: AmountCalculation[]): Decimal | null {
        if (calculations.length === 0) {
            return null;
        }

        return calculations
            .map(c => c.amount)
            .reduce((max, current) => (current.greaterThan(max) ? current : max));
    }

    /**
     * محاسبه حداقل مبلغ
     */
    getMinAmount(calculations: AmountCalculation[]): Decimal | null {
        if (calculations.length === 0) {
            return null;
        }

        return calculations
            .map(c => c.amount)
            .reduce((min, current) => (current.lessThan(min) ? current : min));
    }

    /**
     * دسته‌بندی محاسبات بر اساس نوع دبیتور/بستانکار
     */
    groupByDebitCredit(calculations: AmountCalculation[]): {
        debits: AmountCalculation[];
        credits: AmountCalculation[];
    } {
        return {
            debits: calculations.filter(c => c.isDebit),
            credits: calculations.filter(c => !c.isDebit),
        };
    }

    /**
     * فیلتر محاسبات بر اساس حداقل/حداکثر مبلغ
     */
    filterByAmountRange(
        calculations: AmountCalculation[],
        minAmount: Decimal,
        maxAmount: Decimal,
    ): AmountCalculation[] {
        return calculations.filter(
            c =>
                c.amount.greaterThanOrEqualTo(minAmount) &&
                c.amount.lessThanOrEqualTo(maxAmount),
        );
    }
}