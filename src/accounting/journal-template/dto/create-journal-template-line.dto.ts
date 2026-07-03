// src/modules/accounting/journal-template/dto/create-journal-template-line.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, IsNumber, IsEnum, IsDecimal } from 'class-validator';
import { TemplateAmountType } from '@prisma/client';

export class CreateJournalTemplateLineDto {
    @ApiProperty({ description: 'شناسه حساب' })
    @IsString()
    accountId: string;

    @ApiProperty({ description: 'آیا بدهکار است' })
    @IsBoolean()
    isDebit: boolean;

    @ApiProperty({ enum: TemplateAmountType })
    @IsEnum(TemplateAmountType)
    amountType: TemplateAmountType;

    @ApiPropertyOptional({ description: 'مبلغ ثابت' })
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 4 })
    amount?: number;

    @ApiPropertyOptional({ description: 'درصد' })
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 4 })
    percentage?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    sortOrder?: number = 0;

    @ApiPropertyOptional({ description: 'مرکز هزینه' })
    @IsOptional()
    @IsString()
    costCenterId?: string;

    @ApiPropertyOptional({ description: 'پروژه' })
    @IsOptional()
    @IsString()
    projectId?: string;

    @ApiPropertyOptional({ description: 'ارز' })
    @IsOptional()
    @IsString()
    currencyId?: string;
}