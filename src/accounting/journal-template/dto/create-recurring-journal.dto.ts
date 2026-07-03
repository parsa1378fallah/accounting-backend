// src/modules/accounting/journal-template/dto/create-recurring-journal.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsString,
    IsEnum,
    IsDateString,
    IsOptional,
    IsNumber,
    IsUUID
} from 'class-validator';
import { RecurringFrequency } from '@prisma/client';
import { Type } from 'class-transformer';
import { Decimal } from 'decimal.js';

export class CreateRecurringJournalDto {
    @ApiProperty({ description: 'شناسه قالب' })
    @IsUUID()
    templateId: string;

    @ApiProperty({ description: 'نام سند تکراری' })
    @IsString()
    name: string;

    @ApiProperty({ enum: RecurringFrequency })
    @IsEnum(RecurringFrequency)
    frequency: RecurringFrequency;

    @ApiProperty({ description: 'تاریخ شروع' })
    @IsDateString()
    startDate: string;

    @ApiPropertyOptional({ description: 'تاریخ پایان (اختیاری)' })
    @IsOptional()
    @IsDateString()
    endDate?: string;

    @ApiPropertyOptional({ description: 'مبلغ پایه (برای درصد و غیره)' })
    @IsOptional()
    @Type(() => Number)
    amount?: number;

    @ApiPropertyOptional({ description: 'توضیحات' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({ description: 'شعبه پیش‌فرض' })
    @IsOptional()
    @IsUUID()
    branchId?: string;

    @ApiPropertyOptional({ description: 'مرکز هزینه پیش‌فرض' })
    @IsOptional()
    @IsUUID()
    costCenterId?: string;

    @ApiPropertyOptional({ description: 'پروژه پیش‌فرض' })
    @IsOptional()
    @IsUUID()
    projectId?: string;
}