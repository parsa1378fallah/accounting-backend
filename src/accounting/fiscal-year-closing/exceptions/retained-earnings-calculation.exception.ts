import { InternalServerErrorException } from '@nestjs/common';

export class RetainedEarningsCalculationException extends InternalServerErrorException {
    constructor() {
        super('Retained earnings calculation failed.');
    }
}