import { InternalServerErrorException } from '@nestjs/common';

export class ClosingPreviewFailedException extends InternalServerErrorException {
    constructor() {
        super('Unable to generate fiscal year closing preview.');
    }
}