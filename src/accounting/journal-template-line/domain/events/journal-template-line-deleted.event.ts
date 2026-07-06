import { IEvent } from '@nestjs/cqrs';

export class JournalTemplateLineDeletedEvent implements IEvent {
    constructor(
        public readonly lineId: string,
        public readonly templateId: string,
        public readonly deletedAt: Date = new Date(),
    ) { }
}