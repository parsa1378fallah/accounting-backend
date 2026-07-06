import {
    IsArray,
    ValidateNested,
    ArrayMinSize,
    ArrayMaxSize,
    IsString,
    IsBoolean,
    IsOptional,
    IsNumber,
    IsDecimal,
    MaxLength,
    Min,
    Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Decimal } from 'decimal.js';
import { TemplateAmountType } from '../../../common/enums/template-amount-type.enum';

/**
 * DTO برای یک خط واحد در bulk operation
 */
export class BulkLineItemDto {
    @ApiProperty({
        description: 'Template ID (UUID)',
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    @IsString({ message: 'templateId must be a string' })
    templateId: string;

    @ApiProperty({
        description: 'Account ID (UUID)',
        example: '550e8400-e29b-41d4-a716-446655440001',
    })
    @IsString({ message: 'accountId must be a string' })
    accountId: string;

    @ApiProperty({
        description: 'Is this a debit entry?',
        example: true,
        type: Boolean,
    })
    @IsBoolean({ message: 'isDebit must be a boolean' })
    isDebit: boolean;

    @ApiProperty({
        description: 'Amount type (FIXED, PERCENTAGE, FORMULA)',
        enum: TemplateAmountType,
        example: TemplateAmountType.FIXED,
    })
    @IsString({ message: 'amountType must be a string' })
    amountType: TemplateAmountType;

    @ApiPropertyOptional({
        description:
            'Fixed amount (required if amountType is FIXED). Format: decimal with up to 4 decimal places',
        example: '1000.0000',
    })
    @IsOptional()
    @IsDecimal(
        { decimal_digits: '1,4' },
        {
            message:
                'amount must be a valid decimal with up to 4 decimal places',
        },
    )
    amount?: Decimal | string;

    @ApiPropertyOptional({
        description:
            'Percentage value (required if amountType is PERCENTAGE). Must be between 0 and 100',
        example: '10.00',
        minimum: 0,
        maximum: 100,
    })
    @IsOptional()
    @IsDecimal(
        { decimal_digits: '1,2' },
        {
            message:
                'percentage must be a valid decimal with up to 2 decimal places',
        },
    )
    @Min(0, { message: 'percentage must be at least 0' })
    @Max(100, { message: 'percentage must be at most 100' })
    percentage?: Decimal | string;

    @ApiPropertyOptional({
        description:
            'Formula expression (required if amountType is FORMULA). Example: ($baseAmount * 10) / 100',
        example: '($baseAmount * 10) / 100',
        maxLength: 1000,
    })
    @IsOptional()
    @IsString({ message: 'formula must be a string' })
    @MaxLength(1000, {
        message: 'formula must not exceed 1000 characters',
    })
    formula?: string;

    @ApiPropertyOptional({
        description: 'Description of this line',
        example: 'Main revenue account',
        maxLength: 500,
    })
    @IsOptional()
    @IsString({ message: 'description must be a string' })
    @MaxLength(500, {
        message: 'description must not exceed 500 characters',
    })
    description?: string;

    @ApiPropertyOptional({
        description: 'Sort order for displaying lines (0-999)',
        example: 0,
        minimum: 0,
        maximum: 999,
    })
    @IsOptional()
    @IsNumber(
        { allowInfinity: false, allowNaN: false },
        {
            message: 'sortOrder must be a valid number',
        },
    )
    @Min(0, { message: 'sortOrder must be at least 0' })
    @Max(999, { message: 'sortOrder must be at most 999' })
    sortOrder?: number;

    @ApiPropertyOptional({
        description: 'Cost Center ID (UUID). Optional reference to cost center',
        example: '550e8400-e29b-41d4-a716-446655440002',
    })
    @IsOptional()
    @IsString({ message: 'costCenterId must be a string' })
    costCenterId?: string;

    @ApiPropertyOptional({
        description: 'Project ID (UUID). Optional reference to project',
        example: '550e8400-e29b-41d4-a716-446655440003',
    })
    @IsOptional()
    @IsString({ message: 'projectId must be a string' })
    projectId?: string;

    @ApiPropertyOptional({
        description:
            'Currency ID (UUID). Optional reference to currency for amount precision',
        example: '550e8400-e29b-41d4-a716-446655440004',
    })
    @IsOptional()
    @IsString({ message: 'currencyId must be a string' })
    currencyId?: string;
}

/**
 * DTO برای bulk create operation
 */
export class BulkCreateJournalTemplateLineDto {
    @ApiProperty({
        description:
            'Array of journal template lines to create. Minimum 1 line, maximum 1000 lines per request',
        type: [BulkLineItemDto],
        minItems: 1,
        maxItems: 1000,
    })
    @IsArray({ message: 'lines must be an array' })
    @ArrayMinSize(1, {
        message: 'lines array must contain at least 1 item',
    })
    @ArrayMaxSize(1000, {
        message: 'lines array must not exceed 1000 items per bulk operation',
    })
    @ValidateNested({
        each: true,
        message: 'Each line must be a valid BulkLineItemDto',
    })
    @Type(() => BulkLineItemDto)
    lines: BulkLineItemDto[];

    /**
     * اگر true باشد، در صورت خرابی یک خط، تمام عملیات متوقف می‌شود
     * اگر false باشد، عملیات ادامه می‌یابد و فقط خطوط موفق ذخیره می‌شوند
     *
     * پیش‌فرض: false (partial success مجاز است)
     */
    @ApiPropertyOptional({
        description:
            'If true, all lines will be rolled back if any line fails (all-or-nothing). If false, continues processing and returns partial results (default: false)',
        example: false,
        default: false,
    })
    @IsOptional()
    @IsBoolean({ message: 'atomic must be a boolean' })
    atomic?: boolean;

    /**
     * برای validations اضافی و business logic
     */
    @ApiPropertyOptional({
        description: 'Skip optional validations (use with caution)',
        example: false,
        default: false,
    })
    @IsOptional()
    @IsBoolean({ message: 'skipValidation must be a boolean' })
    skipValidation?: boolean;
}