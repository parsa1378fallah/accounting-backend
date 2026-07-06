import { Injectable, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { JournalTemplateLineService } from '../services/journal-template-line.service';
import { JournalTemplateLineMapper } from '../mappers/journal-template-line.mapper';
import { JournalTemplateLineResponseDto } from '../../presentation/dtos/response/journal-template-line.response.dto';
import { JournalTemplateLineNotFoundException } from '../../common/exceptions/journal-template-line.exception';

/**
 * Query برای دریافت خط قالب با آی‌دی
 */
export class GetJournalTemplateLineQuery {
    constructor(public readonly id: string) { }
}

/**
 * Use Case برای دریافت خط قالب
 */
@Injectable()
@QueryHandler(GetJournalTemplateLineQuery)
export class GetJournalTemplateLineUseCase
    implements IQueryHandler<GetJournalTemplateLineQuery> {
    private readonly logger = new Logger(
        GetJournalTemplateLineUseCase.name,
    );

    /**
     * ✅ فقط JournalTemplateLineService
     */
    constructor(
        private readonly service: JournalTemplateLineService,
    ) { }

    async execute(
        query: GetJournalTemplateLineQuery,
    ): Promise<JournalTemplateLineResponseDto> {
        this.logger.log(`Getting journal template line: ${query.id}`);

        try {
            const line = await this.service.getById(query.id);

            if (!line) {
                throw new JournalTemplateLineNotFoundException(query.id);
            }

            return JournalTemplateLineMapper.toResponse(line);
        } catch (error) {
            this.logger.error(
                `Failed to get journal template line: ${error.message}`,
            );
            throw error;
        }
    }
}