// src/modules/accounting/journal-template/dto/recurring-journal-query.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsBoolean, IsUUID } from 'class-validator';
import { RecurringFrequency } from '@prisma/client';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

export class RecurringJournalQueryDto extends PaginationQueryDto {
    @ApiPropertyOptional({ enum: RecurringFrequency })
    @IsOptional()
    @IsEnum(RecurringFrequency)
    frequency?: RecurringFrequency;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @ApiPropertyOptional()
    @IsOptional()
    @IsUUID()
    templateId?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsUUID()
    branchId?: string;
}