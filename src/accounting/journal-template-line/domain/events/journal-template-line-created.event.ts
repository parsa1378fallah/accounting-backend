import { IEvent } from '@nestjs/cqrs';

export class JournalTemplateLineCreatedEvent implements IEvent {
    constructor(
        public readonly lineId: string,
        public readonly templateId: string,
        public readonly accountId: string,
        public readonly organizationId: string,
        public readonly createdAt: Date = new Date(),
    ) { }
}