import { BadRequestException } from '@nestjs/common';

export class FiscalYearCloseValidationException extends BadRequestException {
    constructor(message: string) {
        super(message);
    }
}