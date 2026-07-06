import { Injectable, Logger, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Decimal } from 'decimal.js';
import { JournalTemplateLine } from '../../domain/entities/journal-template-line.entity';
import { TemplateLineId } from '../../domain/value-objects/template-line-id.value-object';
import { AmountType } from '../../domain/value-objects/amount-type.value-object';
import { Formula } from '../../domain/value-objects/formula.value-object';
import { LineAmount } from '../../domain/value-objects/line-amount.value-object';
import { DebitCredit } from '../../domain/value-objects/debit-credit.value-object';
import { SortOrder } from '../../domain/value-objects/sort-order.value-object';
import type { JournalTemplateLineRepository } from '../../domain/repositories/journal-template-line.repository.interface';
import { JournalTemplateLineService } from '../services/journal-template-line.service';
import { JournalTemplateLineValidatorService } from '../services/journal-template-line-validator.service';
import { JournalTemplateLineMapper } from '../mappers/journal-template-line.mapper';
import { TemplateLineId as TemplateId } from '../../domain/value-objects/template-line-id.value-object';
import { JournalTemplateLineResponseDto } from '../../presentation/dtos/response/journal-template-line.response.dto';

export class CreateJournalTemplateLineCommand {
    constructor(
        public readonly templateId: string,
        public readonly accountId: string,
        public readonly isDebit: boolean,
        public readonly amountType: string,
        public readonly amount?: Decimal | string,
        public readonly percentage?: Decimal | string,
        public readonly formula?: string,
        public readonly description?: string,
        public readonly sortOrder?: number,
        public readonly costCenterId?: string,
        public readonly projectId?: string,
        public readonly currencyId?: string,
        public readonly organizationId?: string,
    ) { }
}

@Injectable()
@CommandHandler(CreateJournalTemplateLineCommand)
export class CreateJournalTemplateLineUseCase
    implements ICommandHandler<CreateJournalTemplateLineCommand> {
    private readonly logger = new Logger(CreateJournalTemplateLineUseCase.name);

    constructor(
        @Inject('JOURNAL_TEMPLATE_LINE_REPOSITORY')
        private readonly repository: JournalTemplateLineRepository,
        private readonly service: JournalTemplateLineService,
        private readonly validator: JournalTemplateLineValidatorService,
    ) { }

    async execute(
        command: CreateJournalTemplateLineCommand,
    ): Promise<JournalTemplateLineResponseDto> {
        this.logger.log(`Creating journal template line for template: ${command.templateId}`);

        try {
            // ایجاد entity
            const line = JournalTemplateLine.create({
                templateId: command.templateId,
                accountId: command.accountId,
                isDebit: DebitCredit.create(command.isDebit),
                amountType: AmountType.create(command.amountType),
                amount: command.amount
                    ? LineAmount.create(command.amount)
                    : null,
                percentage: command.percentage
                    ? new Decimal(command.percentage)
                    : null,
                formula: command.formula ? Formula.create(command.formula) : null,
                description: command.description,
                sortOrder: command.sortOrder
                    ? SortOrder.create(command.sortOrder)
                    : SortOrder.default(),
                costCenterId: command.costCenterId,
                projectId: command.projectId,
                currencyId: command.currencyId,
                organizationId: command.organizationId || '',
            });

            // اعتبارسنجی
            const errors = this.validator.validate(line);
            if (errors.length > 0) {
                this.logger.warn(`Validation failed: ${JSON.stringify(errors)}`);
                throw new Error(`Validation failed: ${errors[0].message}`);
            }

            // ذخیره
            await this.service.save(line);

            this.logger.log(
                `Journal template line created: ${line.getId().value}`,
            );

            return JournalTemplateLineMapper.toResponse(line);
        } catch (error) {
            this.logger.error(
                `Failed to create journal template line: ${error.message}`,
            );
            throw error;
        }
    }
}