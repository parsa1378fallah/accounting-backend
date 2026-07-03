// src/modules/accounting/journal-template/dto/apply-template.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';
import { Decimal } from 'decimal.js';

export class ApplyTemplateDto {
    @ApiProperty({ description: 'شناسه قالب' })
    @IsString()
    templateId: string;

    @ApiProperty({ description: 'تاریخ سند' })
    @IsDateString()
    entryDate: string;

    @ApiPropertyOptional({ description: 'مبلغ پایه (در صورت نیاز)' })
    @IsOptional()
    @Transform(({ value }) => new Decimal(value))
    baseAmount?: Decimal;

    @ApiPropertyOptional({ description: 'توضیحات سند' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({ description: 'شناسه شعبه' })
    @IsOptional()
    @IsString()
    branchId?: string;

    @ApiPropertyOptional({ description: 'مرکز هزینه پیش‌فرض' })
    @IsOptional()
    @IsString()
    costCenterId?: string;

    @ApiPropertyOptional({ description: 'پروژه پیش‌فرض' })
    @IsOptional()
    @IsString()
    projectId?: string;
}