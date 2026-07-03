import { Injectable } from '@nestjs/common';
import { JournalEntryBalancedValidator } from './journal-entry-balanced.validator';

@Injectable()
export class NoUnbalancedJournalEntriesValidator {
    constructor(
        private readonly balancedValidator: JournalEntryBalancedValidator,
    ) { }

    async validate(fiscalYearId: string): Promise<void> {
        await this.balancedValidator.validate(fiscalYearId);
    }
}