import { ForbiddenException } from '@nestjs/common';

export class FiscalYearReopenNotAllowedException extends ForbiddenException {
    constructor() {
        super('Fiscal year cannot be reopened.');
    }
}