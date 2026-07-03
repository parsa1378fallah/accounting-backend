// src/modules/accounting/journal-template/events/journal-template.event.ts
import { JournalTemplateEntity } from '../entities/journal-template.entity';

export class JournalTemplateCreatedEvent {
    constructor(
        public readonly template: JournalTemplateEntity,
        public readonly createdById: string,
    ) { }
}

export class JournalTemplateUpdatedEvent {
    constructor(
        public readonly templateId: string,
        public readonly template: JournalTemplateEntity,
        public readonly updatedById: string,
    ) { }
}

export class JournalTemplateDeletedEvent {
    constructor(
        public readonly templateId: string,
        public readonly deletedById: string,
    ) { }
}

export class JournalTemplateAppliedEvent {
    constructor(
        public readonly templateId: string,
        public readonly journalEntryId: string,
        public readonly journalNumber: string,
        public readonly appliedById?: string,
    ) { }
}