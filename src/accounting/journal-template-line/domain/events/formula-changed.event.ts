import { IEvent } from '@nestjs/cqrs';

export class FormulaChangedEvent implements IEvent {
    constructor(
        public readonly lineId: string,
        public readonly oldFormula: string,
        public readonly newFormula: string,
        public readonly changedAt: Date = new Date(),
    ) { }
}