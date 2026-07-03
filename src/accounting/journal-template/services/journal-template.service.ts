
// src/modules/accounting/journal-template/services/journal-template.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateJournalTemplateDto } from '../dto/create-journal-template.dto';
import { UpdateJournalTemplateDto } from '../dto/update-journal-template.dto';
import { JournalTemplateQueryDto } from '../dto/journal-template-query.dto';
import { JournalTemplateRepository } from '../repositories/journal-template.repository';
import { TemplateBalanceValidator } from '../validators/template-balance.validator';
import { JOURNAL_TEMPLATE_EVENTS, JournalTemplateCreatedEvent, JournalTemplateUpdatedEvent, JournalTemplateDeletedEvent } from '../events';

@Injectable()
export class JournalTemplateService {
    constructor(
        private readonly repository: JournalTemplateRepository,
        private readonly balanceValidator: TemplateBalanceValidator,
        private readonly eventEmitter: EventEmitter2,
    ) { }

    async create(dto: CreateJournalTemplateDto, userId: string, organizationId: string) {
        // ۱. اعتبارسنجی
        this.balanceValidator.validate(dto.lines);

        return await this.repository.createWithLines(dto, userId, organizationId);
    }

    async findAll(query: JournalTemplateQueryDto, organizationId: string) {
        return this.repository.findAll(query, organizationId);
    }

    async findOne(id: string, organizationId: string) {
        return this.repository.findOneOrThrow(id, organizationId);
    }

    async update(id: string, dto: UpdateJournalTemplateDto, userId: string, organizationId: string) {
        // اعتبارسنجی دوباره اگر خطوط تغییر کرده باشد
        if (dto.lines?.length) {
            this.balanceValidator.validate(dto.lines);
        }

        const updated = await this.repository.updateWithLines(id, dto, userId, organizationId);

        this.eventEmitter.emit(
            JOURNAL_TEMPLATE_EVENTS.UPDATED,
            new JournalTemplateUpdatedEvent(id, updated, userId),
        );

        return updated;
    }

    async remove(id: string, userId: string, organizationId: string) {
        await this.repository.softDelete(id, organizationId);

        this.eventEmitter.emit(
            JOURNAL_TEMPLATE_EVENTS.DELETED,
            new JournalTemplateDeletedEvent(id, userId),
        );

        return { success: true };
    }
}