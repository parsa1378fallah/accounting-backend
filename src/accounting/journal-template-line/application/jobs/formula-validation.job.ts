import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { JournalTemplateLineCreatedEvent } from '../../domain/events/journal-template-line-created.event';
import { JournalTemplateLineUpdatedEvent } from '../../domain/events/journal-template-line-updated.event';
import { JournalTemplateLineCacheService } from '../services/journal-template-line-cache.service';

@Injectable()
export class TemplateSyncJobHandler {
    private readonly logger = new Logger(TemplateSyncJobHandler.name);

    constructor(
        private readonly cacheService: JournalTemplateLineCacheService,
    ) { }

    @OnEvent('JournalTemplateLineCreatedEvent')
    async handleLineCreated(event: JournalTemplateLineCreatedEvent) {
        this.logger.log(`Syncing template after line creation: ${event.templateId}`);

        try {
            await this.cacheService.invalidateCache(event.templateId);
        } catch (error) {
            this.logger.error(`Sync failed: ${error.message}`);
        }
    }

    @OnEvent('JournalTemplateLineUpdatedEvent')
    async handleLineUpdated(event: JournalTemplateLineUpdatedEvent) {
        this.logger.log(`Syncing template after line update: ${event.templateId}`);

        try {
            await this.cacheService.invalidateCache(event.templateId);
        } catch (error) {
            this.logger.error(`Sync failed: ${error.message}`);
        }
    }
}