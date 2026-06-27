import {
    ApiPropertyOptional,
} from '@nestjs/swagger';

import {
    IsOptional,
    IsUUID,
    IsEnum,
    IsString,
    IsDateString,
    IsInt,
    Min,
} from 'class-validator';

import { Type } from 'class-transformer';
import { JournalEntryStatus } from '@prisma/client';

export class JournalQueryDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsUUID()
    organizationId?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsUUID()
    branchId?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsUUID()
    fiscalYearId?: string;

    @ApiPropertyOptional({
        enum: JournalEntryStatus,
    })
    @IsOptional()
    @IsEnum(JournalEntryStatus)
    status?: JournalEntryStatus;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    entryNumber?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    fromDate?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    toDate?: string;

    @ApiPropertyOptional({
        default: 1,
    })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page = 1;

    @ApiPropertyOptional({
        default: 20,
    })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit = 20;
}