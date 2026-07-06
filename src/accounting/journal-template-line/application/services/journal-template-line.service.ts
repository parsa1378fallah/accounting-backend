import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JournalTemplateLine } from '../../domain/entities/journal-template-line.entity';
import { TemplateLineId } from '../../domain/value-objects/template-line-id.value-object';
import type { JournalTemplateLineRepository } from '../../domain/repositories/journal-template-line.repository.interface';
import { JournalTemplateLineNotFoundException } from '../../common/exceptions/journal-template-line.exception';

@Injectable()
export class JournalTemplateLineService {
    private readonly logger = new Logger(JournalTemplateLineService.name);

    constructor(
        private readonly repository: JournalTemplateLineRepository,
        private readonly eventEmitter: EventEmitter2,
    ) { }

    async getById(id: string): Promise<JournalTemplateLine> {
        this.logger.debug(`Getting journal template line: ${id}`);

        const line = await this.repository.getById(TemplateLineId.of(id));

        if (!line) {
            throw new JournalTemplateLineNotFoundException(id);
        }

        return line;
    }

    async getByIdOrNull(id: string): Promise<JournalTemplateLine | null> {
        try {
            return await this.getById(id);
        } catch {
            return null;
        }
    }

    async findByTemplate(
        templateId: string,
        organizationId: string,
    ): Promise<JournalTemplateLine[]> {
        this.logger.debug(`Finding lines for template: ${templateId}`);
        return this.repository.findByTemplate(templateId, organizationId);
    }

    async findByAccount(
        accountId: string,
        organizationId: string,
    ): Promise<JournalTemplateLine[]> {
        this.logger.debug(`Finding lines for account: ${accountId}`);
        return this.repository.findByAccount(accountId, organizationId);
    }

    async findByOrganization(
        organizationId: string,
    ): Promise<JournalTemplateLine[]> {
        this.logger.debug(`Finding lines for organization: ${organizationId}`);
        return this.repository.findByOrganization(organizationId);
    }

    async save(line: JournalTemplateLine): Promise<void> {
        this.logger.debug(`Saving journal template line: ${line.getId().value}`);
        await this.repository.save(line);

        // انتشار رویدادهای domain
        const events = line.getDomainEvents();
        for (const event of events) {
            this.eventEmitter.emit(event.constructor.name, event);
        }

        line.clearDomainEvents();
    }

    async delete(id: string): Promise<void> {
        this.logger.debug(`Deleting journal template line: ${id}`);

        const line = await this.getById(id);
        line.delete();

        await this.save(line);
    }

    async countByTemplate(templateId: string): Promise<number> {
        return this.repository.count(templateId);
    }

    async exists(id: string): Promise<boolean> {
        return this.repository.existsById(TemplateLineId.of(id));
    }
}