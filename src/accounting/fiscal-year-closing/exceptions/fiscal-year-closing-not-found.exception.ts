import { NotFoundException } from '@nestjs/common';

export class FiscalYearClosingNotFoundException extends NotFoundException {
    constructor() {
        super('Fiscal year closing record was not found.');
    }
}