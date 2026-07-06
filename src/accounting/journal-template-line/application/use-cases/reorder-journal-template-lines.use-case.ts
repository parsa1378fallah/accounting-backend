import { Injectable, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JournalTemplateLineService } from '../services/journal-template-line.service';
import { TemplateLineSorterService } from '../services/template-line-sorter.service';

/**
 * Command برای ترتیب‌بندی مجدد خطوط
 */
export class ReorderJournalTemplateLinesCommand {
    constructor(
        public readonly templateId: string,
        public readonly organizationId: string,
        public readonly lineIdToSortOrder: Map<string, number>,
    ) { }
}

/**
 * Use Case برای ترتیب‌بندی مجدد خطوط قالب
 */
@Injectable()
@CommandHandler(ReorderJournalTemplateLinesCommand)
export class ReorderJournalTemplateLinesUseCase
    implements ICommandHandler<ReorderJournalTemplateLinesCommand> {
    private readonly logger = new Logger(
        ReorderJournalTemplateLinesUseCase.name,
    );

    /**
     * ✅ فقط Services لازم
     */
    constructor(
        private readonly service: JournalTemplateLineService,
        private readonly sorter: TemplateLineSorterService,
    ) { }

    async execute(
        command: ReorderJournalTemplateLinesCommand,
    ): Promise<void> {
        this.logger.log(
            `Reordering lines for template: ${command.templateId}`,
        );

        try {
            const lines = await this.service.findByTemplate(
                command.templateId,
                command.organizationId,
            );

            const reorderedLines = this.sorter.reorder(
                lines,
                command.lineIdToSortOrder,
            );

            // ذخیره تمام خطوط
            for (const line of reorderedLines) {
                await this.service.save(line);
            }

            this.logger.log(`Lines reordered successfully`);
        } catch (error) {
            this.logger.error(`Failed to reorder lines: ${error.message}`);
            throw error;
        }
    }
}