import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { FormulaChangedEvent } from '../../domain/events/formula-changed.event';
import { Formula } from '../../domain/value-objects/formula.value-object';

@Injectable()
export class FormulaValidationJobHandler {
    private readonly logger = new Logger(FormulaValidationJobHandler.name);

    @OnEvent('FormulaChangedEvent')
    async handleFormulaChanged(event: FormulaChangedEvent) {
        this.logger.log(`Validating formula for line: ${event.lineId}`);

        try {
            // اعتبارسنجی فرمول جدید
            Formula.create(event.newFormula);
            this.logger.log(`Formula validation passed: ${event.newFormula}`);
        } catch (error) {
            this.logger.error(
                `Formula validation failed: ${error.message}`,
            );
            // می‌تواند alert یا notification ارسال کند
        }
    }
}