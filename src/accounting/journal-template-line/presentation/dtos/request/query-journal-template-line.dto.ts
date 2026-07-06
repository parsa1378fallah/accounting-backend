import { IsString, IsOptional, IsNumber, IsBoolean, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class QueryJournalTemplateLineDto {
    @ApiPropertyOptional({
        description: 'Template ID filter',
    })
    @IsOptional()
    @IsString()
    templateId?: string;

    @ApiPropertyOptional({
        description: 'Account ID filter',
    })
    @IsOptional()
    @IsString()
    accountId?: string;

    @ApiPropertyOptional({
        description: 'Cost Center ID filter',
    })
    @IsOptional()
    @IsString()
    costCenterId?: string;

    @ApiPropertyOptional({
        description: 'Project ID filter',
    })
    @IsOptional()
    @IsString()
    projectId?: string;

    @ApiPropertyOptional({
        description: 'Is Debit filter',
    })
    @IsOptional()
    @IsBoolean()
    isDebit?: boolean;

    @ApiPropertyOptional({
        description: 'Page number (1-based)',
        minimum: 1,
        default: 1,
    })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({
        description: 'Items per page',
        minimum: 1,
        maximum: 100,
        default: 10,
    })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    @Min(1)
    @Max(100)
    limit?: number = 10;

    @ApiPropertyOptional({
        description: 'Sort by field',
        example: 'sortOrder',
    })
    @IsOptional()
    @IsString()
    sortBy?: string;

    @ApiPropertyOptional({
        description: 'Sort order (asc or desc)',
        enum: ['asc', 'desc'],
        default: 'asc',
    })
    @IsOptional()
    @IsString()
    sortOrder?: 'asc' | 'desc' = 'asc';

    @ApiPropertyOptional({
        description: 'Search term',
    })
    @IsOptional()
    @IsString()
    search?: string;
}