import {
    BadRequestException,
    Injectable,
} from '@nestjs/common';

import {
    JournalEntry,
    JournalEntryLine,
} from '@prisma/client';

import {
    JournalBalanceValidator,
    BalanceValidationOptions,
} from '../validators/domains/journal-balance.validator';

export interface JournalValidationResult {
    valid: boolean;

    balance: ReturnType<JournalBalanceValidator['run']>;
}

@Injectable()
export class JournalValidationService {
    constructor(
        private readonly balanceValidator: JournalBalanceValidator,
    ) { }

    validate(
        journal: JournalEntry,
        lines: JournalEntryLine[],
        options: BalanceValidationOptions = {},
    ): JournalValidationResult {

        const balance =
            this.balanceValidator.run(
                lines,
                options,
            );

        return {
            valid: balance.valid,
            balance,
        };
    }

    validateOrThrow(
        journal: JournalEntry,
        lines: JournalEntryLine[],
        options: BalanceValidationOptions = {},
    ): void {

        const result =
            this.validate(
                journal,
                lines,
                options,
            );

        if (!result.valid) {
            throw new BadRequestException(result);
        }
    }

    async validateAsync(
        journal: JournalEntry,
        lines: JournalEntryLine[],
        options: BalanceValidationOptions = {},
        exchangeRates?: Record<string, number>,
    ) {

        const balance =
            await this.balanceValidator.runAsync(
                lines,
                options,
                exchangeRates,
            );

        return {
            valid: balance.valid,
            balance,
        };
    }

    async validateAsyncOrThrow(
        journal: JournalEntry,
        lines: JournalEntryLine[],
        options: BalanceValidationOptions = {},
        exchangeRates?: Record<string, number>,
    ): Promise<void> {

        const result =
            await this.validateAsync(
                journal,
                lines,
                options,
                exchangeRates,
            );

        if (!result.valid) {
            throw new BadRequestException(result);
        }
    }
}