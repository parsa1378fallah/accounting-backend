import { InternalServerErrorException } from '@nestjs/common';

export class ClosingJournalEntryFailedException extends InternalServerErrorException {
    constructor() {
        super('Failed to create fiscal year closing journal entry.');
    }
}