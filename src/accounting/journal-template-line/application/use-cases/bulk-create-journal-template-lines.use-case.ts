import { Injectable, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateJournalTemplateLineUseCase, CreateJournalTemplateLineCommand } from './create-journal-template-line.use-case';
import { JournalTemplateLineResponseDto } from '../../presentation/dtos/response/journal-template-line.response.dto';

/**
 * Command برای bulk create
 */
export class BulkCreateJournalTemplateLinesCommand {
    constructor(
        public readonly lines: CreateJournalTemplateLineCommand[],
    ) { }
}

/**
 * Use Case برای bulk create خطوط قالب
 */
@Injectable()
@CommandHandler(BulkCreateJournalTemplateLinesCommand)
export class BulkCreateJournalTemplateLinesUseCase
    implements ICommandHandler<BulkCreateJournalTemplateLinesCommand> {
    private readonly logger = new Logger(
        BulkCreateJournalTemplateLinesUseCase.name,
    );

    /**
     * ✅ فقط CreateJournalTemplateLineUseCase
     */
    constructor(
        private readonly createUseCase: CreateJournalTemplateLineUseCase,
    ) { }

    async execute(
        command: BulkCreateJournalTemplateLinesCommand,
    ): Promise<JournalTemplateLineResponseDto[]> {
        this.logger.log(
            `Creating ${command.lines.length} journal template lines in bulk`,
        );

        try {
            const results = await Promise.all(
                command.lines.map(line => this.createUseCase.execute(line)),
            );

            this.logger.log(`Successfully created ${results.length} lines`);
            return results;
        } catch (error) {
            this.logger.error(
                `Failed to bulk create journal template lines: ${error.message}`,
            );
            throw error;
        }
    }
}