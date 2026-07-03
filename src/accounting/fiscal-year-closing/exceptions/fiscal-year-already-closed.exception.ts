import { ConflictException } from '@nestjs/common';

export class FiscalYearAlreadyClosedException extends ConflictException {
    constructor() {
        super('Fiscal year is already closed.');
    }
}