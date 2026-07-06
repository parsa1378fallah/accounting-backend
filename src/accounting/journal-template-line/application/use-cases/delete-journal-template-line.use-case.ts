import { Injectable, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JournalTemplateLineService } from '../services/journal-template-line.service';

/**
 * Command برای حذف خط قالب
 */
export class DeleteJournalTemplateLineCommand {
    constructor(public readonly id: string) { }
}

/**
 * Use Case برای حذف خط قالب
 */
@Injectable()
@CommandHandler(DeleteJournalTemplateLineCommand)
export class DeleteJournalTemplateLineUseCase
    implements ICommandHandler<DeleteJournalTemplateLineCommand> {
    private readonly logger = new Logger(
        DeleteJournalTemplateLineUseCase.name,
    );

    /**
     * ✅ صحیح: فقط JournalTemplateLineService را inject کنید
     * خدمات دیگر از طریق JournalTemplateLineService دسترسی پیدا می‌کنند
     */
    constructor(
        private readonly service: JournalTemplateLineService,
    ) { }

    async execute(
        command: DeleteJournalTemplateLineCommand,
    ): Promise<void> {
        this.logger.log(`Deleting journal template line: ${command.id}`);

        try {
            // ✅ فقط service کافی است
            await this.service.delete(command.id);
            this.logger.log(`Journal template line deleted: ${command.id}`);
        } catch (error) {
            this.logger.error(
                `Failed to delete journal template line: ${error.message}`,
            );
            throw error;
        }
    }
}