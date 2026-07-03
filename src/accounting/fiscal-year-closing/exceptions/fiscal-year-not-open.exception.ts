import { ConflictException } from '@nestjs/common';

export class FiscalYearNotOpenException extends ConflictException {
    constructor() {
        super('Fiscal year is not open.');
    }
}