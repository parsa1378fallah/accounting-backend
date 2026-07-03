// src/modules/accounting/journal-template/services/journal-template-resolver.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ApplyTemplateDto } from '../dto/apply-template.dto';
import { AmountCalculationStrategyFactory } from '../strategies/amount-calculation.strategy';
import { JournalTemplateRepository } from '../repositories/journal-template.repository';
import { JournalEntryService } from '../../journal/services/journal-entry.service';
import { FiscalYearService } from 'src/fiscal-year/fiscal-year.service';
import { JOURNAL_TEMPLATE_EVENTS, JournalTemplateAppliedEvent } from '../events';
import { Decimal } from 'decimal.js';
import { JournalReferenceType } from './../../journal/dto/create-journal-entry.dto';
@Injectable()
export class JournalTemplateResolverService {
    constructor(
        private readonly templateRepo: JournalTemplateRepository,
        private readonly journalEntryService: JournalEntryService,
        private readonly fiscalYearService: FiscalYearService,
        private readonly strategyFactory: AmountCalculationStrategyFactory,
        private readonly eventEmitter: EventEmitter2,
    ) { }

    async applyTemplate(dto: ApplyTemplateDto, userId: string, organizationId: string) {
        const template = await this.templateRepo.findOneOrThrow(dto.templateId, organizationId);

        const currentFiscalYear = await this.fiscalYearService.findActive(organizationId);

        if (!currentFiscalYear) {
            throw new BadRequestException('سال مالی فعال یافت نشد');
        }
        const journalLines = this.buildJournalLines(template, dto);

        const journalEntry = await this.journalEntryService.createJournalEntry({
            organizationId,
            fiscalYearId: currentFiscalYear.id,
            branchId: dto.branchId ?? " ",
            description: dto.description || template.description || `سند از قالب: ${template.name}`,
            referenceType: JournalReferenceType.JOURNAL_TEMPLATE,        // حالا معتبر است
            referenceId: template.id,
            lines: journalLines.map(line => ({
                accountId: line.accountId,
                isDebit: line.isDebit,
                debit: line.debit.toNumber(),
                credit: line.credit.toNumber(),
                description: line.description,
                costCenterId: line.costCenterId,
                projectId: line.projectId,
                currencyId: line.currencyId,
                sortOrder: line.sortOrder,
            })),
            //   postedById: userId,
        });

        this.eventEmitter.emit(
            JOURNAL_TEMPLATE_EVENTS.APPLIED,
            new JournalTemplateAppliedEvent(
                template.id,
                journalEntry.id,
                journalEntry.entryNumber,
                userId,
            ),
        );

        return journalEntry;
    }

    private buildJournalLines(template: any, dto: ApplyTemplateDto) {
        const baseAmount = dto.baseAmount ? new Decimal(dto.baseAmount) : undefined;

        const lines: any[] = [];

        for (const line of template.lines) {
            const strategy = this.strategyFactory.getStrategy(line.amountType);

            const amount = strategy.calculate({
                baseAmount,
                line: {
                    ...line,
                    amount: line.amount ? Number(line.amount) : undefined,
                    percentage: line.percentage ? Number(line.percentage) : undefined,
                },
            });

            if (amount.isZero()) continue;

            lines.push({
                accountId: line.accountId,
                isDebit: line.isDebit,
                debit: line.isDebit ? amount : new Decimal(0),
                credit: !line.isDebit ? amount : new Decimal(0),
                description: line.description || template.description,
                costCenterId: line.costCenterId || dto.costCenterId,
                projectId: line.projectId || dto.projectId,
                currencyId: line.currencyId,
                sortOrder: line.sortOrder,
            });
        }

        if (lines.length === 0) {
            throw new BadRequestException('هیچ خط معتبری از قالب تولید نشد');
        }

        return lines;
    }
}