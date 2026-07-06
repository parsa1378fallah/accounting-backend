import { Injectable, Logger } from '@nestjs/common';
import { JournalTemplateLine } from '../../domain/entities/journal-template-line.entity';
import { SortOrder } from '../../domain/value-objects/sort-order.value-object';

@Injectable()
export class TemplateLineSorterService {
    private readonly logger = new Logger(TemplateLineSorterService.name);

    sort(lines: JournalTemplateLine[]): JournalTemplateLine[] {
        this.logger.debug(`Sorting ${lines.length} lines`);

        return lines.sort(
            (a, b) => a.getSortOrder().value - b.getSortOrder().value,
        );
    }

    reorder(
        lines: JournalTemplateLine[],
        lineIdToSortOrder: Map<string, number>,
    ): JournalTemplateLine[] {
        this.logger.debug(`Reordering lines with map size: ${lineIdToSortOrder.size}`);

        const updated = lines.map(line => {
            const newSortOrder = lineIdToSortOrder.get(line.getId().value);
            if (newSortOrder !== undefined) {
                line.reorderLine(SortOrder.create(newSortOrder));
            }
            return line;
        });

        return this.sort(updated);
    }

    getNextSortOrder(lines: JournalTemplateLine[]): number {
        if (lines.length === 0) {
            return 0;
        }

        const maxOrder = Math.max(
            ...lines.map(l => l.getSortOrder().value),
        );

        return maxOrder + 1;
    }

    validateSortOrders(lines: JournalTemplateLine[]): boolean {
        const sortOrders = lines.map(l => l.getSortOrder().value);
        const uniqueOrders = new Set(sortOrders);

        return uniqueOrders.size === sortOrders.length;
    }
}