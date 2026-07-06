import { IsString, IsBoolean, IsOptional, IsNumber, IsDecimal, IsObject, MaxLength, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Decimal } from 'decimal.js';
import { TemplateAmountType } from 'src/accounting/journal-template-line/common/enums/template-amount-type.enum';

export class CreateJournalTemplateLineDto {
    @ApiProperty({
        description: 'Template ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    @IsString()
    templateId: string;

    @ApiProperty({
        description: 'Account ID',
        example: '550e8400-e29b-41d4-a716-446655440001',
    })
    @IsString()
    accountId: string;

    @ApiProperty({
        description: 'Is Debit Entry',
        example: true,
    })
    @IsBoolean()
    isDebit: boolean;

    @ApiProperty({
        description: 'Amount Type (FIXED, PERCENTAGE, FORMULA)',
        enum: TemplateAmountType,
        example: TemplateAmountType.FIXED,
    })
    @IsString()
    amountType: TemplateAmountType;

    @ApiPropertyOptional({
        description: 'Fixed Amount (for FIXED type)',
        example: '1000.0000',
    })
    @IsOptional()
    @IsDecimal()
    amount?: Decimal;

    @ApiPropertyOptional({
        description: 'Percentage (for PERCENTAGE type)',
        example: '10.00',
        minimum: 0,
        maximum: 100,
    })
    @IsOptional()
    @IsDecimal()
    @Min(0)
    @Max(100)
    percentage?: Decimal;

    @ApiPropertyOptional({
        description: 'Formula (for FORMULA type)',
        example: '($baseAmount * 10) / 100',
    })
    @IsOptional()
    @IsString()
    @MaxLength(1000)
    formula?: string;

    @ApiPropertyOptional({
        description: 'Description',
        example: 'Main revenue account',
        maxLength: 500,
    })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    description?: string;

    @ApiPropertyOptional({
        description: 'Sort Order',
        example: 0,
        minimum: 0,
        maximum: 999,
    })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(999)
    sortOrder?: number;

    @ApiPropertyOptional({
        description: 'Cost Center ID',
        example: '550e8400-e29b-41d4-a716-446655440002',
    })
    @IsOptional()
    @IsString()
    costCenterId?: string;

    @ApiPropertyOptional({
        description: 'Project ID',
        example: '550e8400-e29b-41d4-a716-446655440003',
    })
    @IsOptional()
    @IsString()
    projectId?: string;

    @ApiPropertyOptional({
        description: 'Currency ID',
        example: '550e8400-e29b-41d4-a716-446655440004',
    })
    @IsOptional()
    @IsString()
    currencyId?: string;
}