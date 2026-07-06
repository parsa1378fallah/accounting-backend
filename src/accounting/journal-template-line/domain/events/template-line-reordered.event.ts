import { IEvent } from '@nestjs/cqrs';

export class TemplateLineReorderedEvent implements IEvent {
    constructor(
        public readonly lineId: string,
        public readonly templateId: string,
        public readonly oldSortOrder: number,
        public readonly newSortOrder: number,
        public readonly reorderedAt: Date = new Date(),
    ) { }
}