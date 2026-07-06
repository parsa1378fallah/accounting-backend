import {
    IsString,
    IsBoolean,
    IsOptional,
    IsNumber,
    IsDecimal,
    MaxLength,
    Min,
    Max,
    ValidateIf,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Decimal } from 'decimal.js';
import { TemplateAmountType } from '../../../common/enums/template-amount-type.enum';

/**
 * DTO برای update journal template line
 *
 * این DTO از PartialType الهام گرفته شده، اما تمام فیلدها اختیاری هستند
 * فقط فیلدهایی که می‌خواهید تغییر دهید را ارسال کنید
 */
export class UpdateJournalTemplateLineDto {
    @ApiPropertyOptional({
        description: 'Is this a debit entry?',
        example: true,
        type: Boolean,
    })
    @IsOptional()
    @IsBoolean({
        message: 'isDebit must be a boolean',
    })
    isDebit?: boolean;

    @ApiPropertyOptional({
        description: 'Amount type (FIXED, PERCENTAGE, FORMULA)',
        enum: TemplateAmountType,
        example: TemplateAmountType.FIXED,
    })
    @IsOptional()
    @IsString({
        message: 'amountType must be a string',
    })
    amountType?: TemplateAmountType;

    @ApiPropertyOptional({
        description:
            'Fixed amount (required if amountType is FIXED). Format: decimal with up to 4 decimal places',
        example: '1000.0000',
    })
    @IsOptional()
    @ValidateIf((obj) => obj.amount !== undefined)
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
    @ValidateIf((obj) => obj.percentage !== undefined)
    @IsDecimal(
        { decimal_digits: '1,2' },
        {
            message:
                'percentage must be a valid decimal with up to 2 decimal places',
        },
    )
    @Min(0, {
        message: 'percentage must be at least 0',
    })
    @Max(100, {
        message: 'percentage must be at most 100',
    })
    percentage?: Decimal | string;

    @ApiPropertyOptional({
        description:
            'Formula expression (required if amountType is FORMULA). Example: ($baseAmount * 10) / 100',
        example: '($baseAmount * 10) / 100',
        maxLength: 1000,
    })
    @IsOptional()
    @ValidateIf((obj) => obj.formula !== undefined)
    @IsString({
        message: 'formula must be a string',
    })
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
    @IsString({
        message: 'description must be a string',
    })
    @MaxLength(500, {
        message: 'description must not exceed 500 characters',
    })
    description?: string | null;

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
    @Min(0, {
        message: 'sortOrder must be at least 0',
    })
    @Max(999, {
        message: 'sortOrder must be at most 999',
    })
    sortOrder?: number;

    @ApiPropertyOptional({
        description: 'Cost Center ID (UUID). Optional reference to cost center',
        example: '550e8400-e29b-41d4-a716-446655440002',
    })
    @IsOptional()
    @IsString({
        message: 'costCenterId must be a string',
    })
    costCenterId?: string;

    @ApiPropertyOptional({
        description: 'Project ID (UUID). Optional reference to project',
        example: '550e8400-e29b-41d4-a716-446655440003',
    })
    @IsOptional()
    @IsString({
        message: 'projectId must be a string',
    })
    projectId?: string;

    @ApiPropertyOptional({
        description:
            'Currency ID (UUID). Optional reference to currency for amount precision',
        example: '550e8400-e29b-41d4-a716-446655440004',
    })
    @IsOptional()
    @IsString({
        message: 'currencyId must be a string',
    })
    currencyId?: string;

    /**
     * فیلدهای اضافی برای update logic
     */

    @ApiPropertyOptional({
        description: 'Reason for the update (for audit logging)',
        example: 'Corrected formula syntax error',
        maxLength: 500,
    })
    @IsOptional()
    @IsString({
        message: 'updateReason must be a string',
    })
    @MaxLength(500, {
        message: 'updateReason must not exceed 500 characters',
    })
    updateReason?: string;

    @ApiPropertyOptional({
        description: 'If true, update will be applied even if validation fails',
        example: false,
        default: false,
    })
    @IsOptional()
    @IsBoolean({
        message: 'forceUpdate must be a boolean',
    })
    forceUpdate?: boolean;
}