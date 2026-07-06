import { ApiProperty } from '@nestjs/swagger';
import { JournalTemplateLineResponseDto } from './journal-template-line.response.dto';

export class PaginationMetaDto {
    @ApiProperty({
        description: 'Current page',
        example: 1,
    })
    page: number;

    @ApiProperty({
        description: 'Items per page',
        example: 10,
    })
    limit: number;

    @ApiProperty({
        description: 'Total items',
        example: 100,
    })
    total: number;

    @ApiProperty({
        description: 'Total pages',
        example: 10,
    })
    pages: number;

    @ApiProperty({
        description: 'Has next page',
        example: true,
    })
    hasNextPage: boolean;

    @ApiProperty({
        description: 'Has previous page',
        example: false,
    })
    hasPreviousPage: boolean;
}

export class JournalTemplateLineListResponseDto {
    @ApiProperty({
        description: 'List of journal template lines',
        type: [JournalTemplateLineResponseDto],
    })
    data: JournalTemplateLineResponseDto[];

    @ApiProperty({
        description: 'Pagination metadata',
        type: PaginationMetaDto,
    })
    meta: PaginationMetaDto;
}