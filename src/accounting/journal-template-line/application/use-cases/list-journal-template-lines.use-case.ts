import { Injectable, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { JournalTemplateLineService } from '../services/journal-template-line.service';
import { JournalTemplateLineMapper } from '../mappers/journal-template-line.mapper';
import { JournalTemplateLineListResponseDto } from '../../presentation/dtos/response/journal-template-line-list.response.dto';

/**
 * Query برای لیست کردن خطوط قالب
 */
export class ListJournalTemplateLinesQuery {
    constructor(
        public readonly templateId: string,
        public readonly organizationId: string,
        public readonly page: number = 1,
        public readonly limit: number = 10,
    ) { }
}

/**
 * Use Case برای لیست کردن خطوط قالب
 */
@Injectable()
@QueryHandler(ListJournalTemplateLinesQuery)
export class ListJournalTemplateLinesUseCase
    implements IQueryHandler<ListJournalTemplateLinesQuery> {
    private readonly logger = new Logger(
        ListJournalTemplateLinesUseCase.name,
    );

    /**
     * ✅ فقط JournalTemplateLineService
     */
    constructor(
        private readonly service: JournalTemplateLineService,
    ) { }

    async execute(
        query: ListJournalTemplateLinesQuery,
    ): Promise<JournalTemplateLineListResponseDto> {
        this.logger.log(
            `Listing journal template lines for template: ${query.templateId}`,
        );

        try {
            const lines = await this.service.findByTemplate(
                query.templateId,
                query.organizationId,
            );

            const total = lines.length;
            const startIndex = (query.page - 1) * query.limit;
            const endIndex = startIndex + query.limit;
            const paginatedLines = lines.slice(startIndex, endIndex);

            return {
                data: JournalTemplateLineMapper.toResponses(paginatedLines),
                meta: {
                    page: query.page,
                    limit: query.limit,
                    total,
                    pages: Math.ceil(total / query.limit),
                    hasNextPage: endIndex < total,
                    hasPreviousPage: query.page > 1,
                },
            };
        } catch (error) {
            this.logger.error(
                `Failed to list journal template lines: ${error.message}`,
            );
            throw error;
        }
    }
}