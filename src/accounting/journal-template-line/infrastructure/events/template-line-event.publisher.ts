import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JournalTemplateLineCreatedEvent } from '../../domain/events/journal-template-line-created.event';
import { JournalTemplateLineUpdatedEvent } from '../../domain/events/journal-template-line-updated.event';
import { JournalTemplateLineDeletedEvent } from '../../domain/events/journal-template-line-deleted.event';
import { FormulaChangedEvent } from '../../domain/events/formula-changed.event';
import { TemplateLineReorderedEvent } from '../../domain/events/template-line-reordered.event';

@Injectable()
export class TemplateLineEventPublisher {
    private readonly logger = new Logger(TemplateLineEventPublisher.name);

    constructor(
        private readonly eventEmitter: EventEmitter2,
    ) { }

    publishLineCreated(event: JournalTemplateLineCreatedEvent): void {
        this.logger.log(`Publishing event: JournalTemplateLineCreatedEvent`);
        this.eventEmitter.emit('journal-template-line.created', event);
    }

    publishLineUpdated(event: JournalTemplateLineUpdatedEvent): void {
        this.logger.log(`Publishing event: JournalTemplateLineUpdatedEvent`);
        this.eventEmitter.emit('journal-template-line.updated', event);
    }

    publishLineDeleted(event: JournalTemplateLineDeletedEvent): void {
        this.logger.log(`Publishing event: JournalTemplateLineDeletedEvent`);
        this.eventEmitter.emit('journal-template-line.deleted', event);
    }

    publishFormulaChanged(event: FormulaChangedEvent): void {
        this.logger.log(`Publishing event: FormulaChangedEvent`);
        this.eventEmitter.emit('journal-template-line.formula-changed', event);
    }

    publishLineReordered(event: TemplateLineReorderedEvent): void {
        this.logger.log(`Publishing event: TemplateLineReorderedEvent`);
        this.eventEmitter.emit('journal-template-line.reordered', event);
    }

    publishAll(events: any[]): void {
        this.logger.log(`Publishing ${events.length} events`);

        events.forEach(event => {
            if (event instanceof JournalTemplateLineCreatedEvent) {
                this.publishLineCreated(event);
            } else if (event instanceof JournalTemplateLineUpdatedEvent) {
                this.publishLineUpdated(event);
            } else if (event instanceof JournalTemplateLineDeletedEvent) {
                this.publishLineDeleted(event);
            } else if (event instanceof FormulaChangedEvent) {
                this.publishFormulaChanged(event);
            } else if (event instanceof TemplateLineReorderedEvent) {
                this.publishLineReordered(event);
            }
        });
    }
}