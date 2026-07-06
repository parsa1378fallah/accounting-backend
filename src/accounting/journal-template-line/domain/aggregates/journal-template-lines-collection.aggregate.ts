import { AggregateRoot } from '@nestjs/cqrs';
import { JournalTemplateLine } from '../entities/journal-template-line.entity';
import { SortOrder } from '../value-objects/sort-order.value-object';
import { TemplateLineReorderedEvent } from '../events/template-line-reordered.event';

export class JournalTemplatesLinesCollection extends AggregateRoot {
    private lines: JournalTemplateLine[] = [];
    private templateId: string;
    private organizationId: string;

    constructor(templateId: string, organizationId: string) {
        super();
        this.templateId = templateId;
        this.organizationId = organizationId;
    }

    addLine(line: JournalTemplateLine): void {
        if (!this.lines.find(l => l.getId().equals(line.getId()))) {
            this.lines.push(line);
        }
    }

    removeLine(lineId: string): void {
        const index = this.lines.findIndex(l => l.getId().value === lineId);
        if (index > -1) {
            this.lines.splice(index, 1);
        }
    }

    getLines(): JournalTemplateLine[] {
        return [...this.lines];
    }

    getActiveLinesLines(): JournalTemplateLine[] {
        return this.lines.filter(l => !l.isDeleted());
    }

    reorderLines(lineIdToSortOrder: Map<string, number>): void {
        lineIdToSortOrder.forEach((sortOrder, lineId) => {
            const line = this.lines.find(l => l.getId().value === lineId);
            if (line) {
                line.reorderLine(SortOrder.create(sortOrder));
            }
        });

        this.sortLines();
    }

    private sortLines(): void {
        this.lines.sort((a, b) => a.getSortOrder().value - b.getSortOrder().value);
    }

    getLineCount(): number {
        return this.lines.filter(l => !l.isDeleted()).length;
    }

    toJSON() {
        return {
            templateId: this.templateId,
            organizationId: this.organizationId,
            lines: this.lines.map(l => l.toJSON()),
        };
    }
}