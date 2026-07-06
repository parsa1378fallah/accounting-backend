import { IEvent } from '@nestjs/cqrs';

export class JournalTemplateLineUpdatedEvent implements IEvent {
    constructor(
        public readonly lineId: string,
        public readonly templateId: string,
        public readonly changes: Record<string, any>,
        public readonly updatedAt: Date = new Date(),
    ) { }
}