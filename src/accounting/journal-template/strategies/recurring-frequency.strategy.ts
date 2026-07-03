// src/modules/accounting/journal-template/strategies/recurring-frequency.strategy.ts
import { Injectable } from '@nestjs/common';
import { RecurringFrequency } from '@prisma/client';
import { addDays, addWeeks, addMonths, addYears, addBusinessDays } from 'date-fns';

export interface IRecurringFrequencyStrategy {
    calculateNextRun(currentDate: Date): Date;
}

@Injectable()
export class DailyRecurringStrategy implements IRecurringFrequencyStrategy {
    calculateNextRun(currentDate: Date): Date {
        return addDays(currentDate, 1);
    }
}

@Injectable()
export class WeeklyRecurringStrategy implements IRecurringFrequencyStrategy {
    calculateNextRun(currentDate: Date): Date {
        return addWeeks(currentDate, 1);
    }
}

@Injectable()
export class MonthlyRecurringStrategy implements IRecurringFrequencyStrategy {
    calculateNextRun(currentDate: Date): Date {
        return addMonths(currentDate, 1);
    }
}

@Injectable()
export class QuarterlyRecurringStrategy implements IRecurringFrequencyStrategy {
    calculateNextRun(currentDate: Date): Date {
        return addMonths(currentDate, 3);
    }
}

@Injectable()
export class YearlyRecurringStrategy implements IRecurringFrequencyStrategy {
    calculateNextRun(currentDate: Date): Date {
        return addYears(currentDate, 1);
    }
}

// استراتژی‌های پیشرفته (قابل گسترش)
@Injectable()
export class EveryBusinessDayStrategy implements IRecurringFrequencyStrategy {
    calculateNextRun(currentDate: Date): Date {
        return addBusinessDays(currentDate, 1);
    }
}

@Injectable()
export class RecurringFrequencyStrategyFactory {
    constructor(
        private readonly daily: DailyRecurringStrategy,
        private readonly weekly: WeeklyRecurringStrategy,
        private readonly monthly: MonthlyRecurringStrategy,
        private readonly quarterly: QuarterlyRecurringStrategy,
        private readonly yearly: YearlyRecurringStrategy,
        private readonly businessDay: EveryBusinessDayStrategy,
    ) { }

    getStrategy(frequency: RecurringFrequency): IRecurringFrequencyStrategy {
        switch (frequency) {
            case RecurringFrequency.DAILY:
                return this.daily;
            case RecurringFrequency.WEEKLY:
                return this.weekly;
            case RecurringFrequency.MONTHLY:
                return this.monthly;
            case RecurringFrequency.QUARTERLY:
                return this.quarterly;
            case RecurringFrequency.YEARLY:
                return this.yearly;
            // در آینده می‌توانید CUSTOM یا BUSINESS_DAY اضافه کنید
            default:
                return this.monthly;
        }
    }
}