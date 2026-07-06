import { Injectable, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Decimal } from 'decimal.js';
import { AmountType } from '../../domain/value-objects/amount-type.value-object';
import { Formula } from '../../domain/value-objects/formula.value-object';
import { LineAmount } from '../../domain/value-objects/line-amount.value-object';
import { SortOrder } from '../../domain/value-objects/sort-order.value-object';
import { JournalTemplateLineService } from '../services/journal-template-line.service';
import { JournalTemplateLineValidatorService } from '../services/journal-template-line-validator.service';
import { JournalTemplateLineMapper } from '../mappers/journal-template-line.mapper';
import { JournalTemplateLineResponseDto } from '../../presentation/dtos/response/journal-template-line.response.dto';

/**
 * Command برای به‌روزرسانی خط قالب
 */
export class UpdateJournalTemplateLineCommand {
    constructor(
        public readonly id: string,
        public readonly updates: {
            isDebit?: boolean;
            amountType?: string;
            amount?: Decimal | string;
            percentage?: Decimal | string;
            formula?: string;
            description?: string;
            sortOrder?: number;
            costCenterId?: string;
            projectId?: string;
            currencyId?: string;
        },
    ) { }
}

/**
 * Use Case برای به‌روزرسانی خط قالب
 */
@Injectable()
@CommandHandler(UpdateJournalTemplateLineCommand)
export class UpdateJournalTemplateLineUseCase
    implements ICommandHandler<UpdateJournalTemplateLineCommand> {
    private readonly logger = new Logger(
        UpdateJournalTemplateLineUseCase.name,
    );

    /**
     * ✅ فقط Services لازم
     */
    constructor(
        private readonly service: JournalTemplateLineService,
        private readonly validator: JournalTemplateLineValidatorService,
    ) { }

    async execute(
        command: UpdateJournalTemplateLineCommand,
    ): Promise<JournalTemplateLineResponseDto> {
        this.logger.log(`Updating journal template line: ${command.id}`);

        try {
            // دریافت خط موجود
            const line = await this.service.getById(command.id);

            // اعمال تغییرات
            if (command.updates.description !== undefined) {
                line.updateDescription(command.updates.description);
            }

            if (command.updates.amountType) {
                const newAmountType = AmountType.create(
                    command.updates.amountType,
                );

                if (newAmountType.isFixed() && command.updates.amount) {
                    const newAmount = LineAmount.create(command.updates.amount);
                    line.updateAmount(newAmount);
                } else if (
                    newAmountType.isPercentage() &&
                    command.updates.percentage
                ) {
                    const newPercentage = new Decimal(command.updates.percentage);
                    line.updatePercentage(newPercentage);
                } else if (newAmountType.isFormula() && command.updates.formula) {
                    const newFormula = Formula.create(command.updates.formula);
                    line.updateFormula(newFormula);
                }
            }

            if (command.updates.sortOrder !== undefined) {
                line.reorderLine(SortOrder.create(command.updates.sortOrder));
            }

            // اعتبارسنجی
            const errors = this.validator.validate(line);
            if (errors.length > 0) {
                this.logger.warn(`Validation failed: ${JSON.stringify(errors)}`);
                throw new Error(`Validation failed: ${errors[0].message}`);
            }

            // ذخیره
            await this.service.save(line);

            this.logger.log(
                `Journal template line updated: ${line.getId().value}`,
            );

            return JournalTemplateLineMapper.toResponse(line);
        } catch (error) {
            this.logger.error(
                `Failed to update journal template line: ${error.message}`,
            );
            throw error;
        }
    }
}