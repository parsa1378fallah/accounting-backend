// src/modules/accounting/journal-template/strategies/amount-calculation.strategy.ts
import { Injectable } from '@nestjs/common';
import { TemplateAmountType } from '@prisma/client';
import { Decimal } from 'decimal.js';
import { JournalTemplateLineEntity } from '../entities/journal-template-line.entity';

export interface AmountCalculationContext {
    baseAmount?: Decimal;           // مبلغ پایه (مثلاً مبلغ کل سند)
    line: JournalTemplateLineEntity;
    currentJournalLines?: Array<{ isDebit: boolean; amount: Decimal }>; // برای محاسبات پیچیده‌تر
}

export interface IAmountCalculationStrategy {
    calculate(context: AmountCalculationContext): Decimal;
}

@Injectable()
export class FixedAmountStrategy implements IAmountCalculationStrategy {
    calculate(context: AmountCalculationContext): Decimal {
        if (!context.line.amount) {
            return new Decimal(0);
        }
        return new Decimal(context.line.amount);
    }
}

@Injectable()
export class PercentageAmountStrategy implements IAmountCalculationStrategy {
    calculate(context: AmountCalculationContext): Decimal {
        if (!context.baseAmount || !context.line.percentage) {
            return new Decimal(0);
        }
        return context.baseAmount.mul(new Decimal(context.line.percentage).div(100));
    }
}

@Injectable()
export class DynamicAmountStrategy implements IAmountCalculationStrategy {
    calculate(context: AmountCalculationContext): Decimal {
        // اینجا می‌توانید منطق پیچیده‌تری مثل محاسبه مانده حساب، آخرین مبلغ و غیره پیاده کنید
        // فعلاً به عنوان placeholder
        console.warn(`Dynamic amount calculation for line ${context.line.id} needs custom implementation`);
        return new Decimal(0);
    }
}

@Injectable()
export class LastAmountStrategy implements IAmountCalculationStrategy {
    calculate(context: AmountCalculationContext): Decimal {
        // می‌توانید از تاریخچه آخرین استفاده از این قالب استفاده کنید
        // فعلاً placeholder
        return new Decimal(0);
    }
}

/**
 * Factory برای انتخاب استراتژی مناسب
 */
@Injectable()
export class AmountCalculationStrategyFactory {
    constructor(
        private readonly fixedStrategy: FixedAmountStrategy,
        private readonly percentageStrategy: PercentageAmountStrategy,
        private readonly dynamicStrategy: DynamicAmountStrategy,
        private readonly lastAmountStrategy: LastAmountStrategy,
    ) { }

    getStrategy(amountType: TemplateAmountType): IAmountCalculationStrategy {
        switch (amountType) {
            case TemplateAmountType.FIXED:
                return this.fixedStrategy;
            case TemplateAmountType.PERCENT:
                return this.percentageStrategy;
            case TemplateAmountType.DYNAMIC:
                return this.dynamicStrategy;
            case TemplateAmountType.LAST_AMOUNT:
                return this.lastAmountStrategy;
            default:
                return this.fixedStrategy;
        }
    }
}