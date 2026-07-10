import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsObject,
    IsOptional,
    IsString,
    IsEnum,
    Min,
} from 'class-validator';

import { TemplateAmountType }
    from '../domain/enums/template-amount-type.enum';



export class CreateJournalTemplateLineDto {


    @ApiProperty({
        example: 'org_123',
        description: 'Organization identifier',
    })
    @IsString()
    @IsNotEmpty()
    organizationId: string;



    @ApiProperty({
        example: 'template_123',
        description: 'Journal template identifier',
    })
    @IsString()
    @IsNotEmpty()
    templateId: string;



    @ApiProperty({
        example: 'account_123',
        description: 'Accounting account identifier',
    })
    @IsString()
    @IsNotEmpty()
    accountId: string;



    @ApiProperty({
        example: true,
        description: 'Debit or Credit line',
    })
    @IsBoolean()
    isDebit: boolean;



    @ApiProperty({
        enum: TemplateAmountType,
        example: TemplateAmountType.FIXED,
        description: 'Calculation method of line amount',
    })
    @IsEnum(TemplateAmountType)
    amountType: TemplateAmountType;



    @ApiPropertyOptional({
        example: 100000,
        description: 'Fixed amount value',
    })
    @IsOptional()
    @IsNumber()
    amount?: number;



    @ApiPropertyOptional({
        example: 9.5,
        description: 'Percentage value',
    })
    @IsOptional()
    @IsNumber()
    percentage?: number;



    @ApiPropertyOptional({
        example: {
            operator: '+',
            left: 'subtotal',
            right: 'tax'
        },
        description: 'Formula definition',
    })
    @IsOptional()
    @IsObject()
    formula?: Record<string, unknown>;



    @ApiPropertyOptional({
        example: 'VAT expense',
        description: 'Journal line description',
    })
    @IsOptional()
    @IsString()
    description?: string;



    @ApiPropertyOptional({
        example: 1,
        default: 0,
        description: 'Display order',
    })
    @IsOptional()
    @IsNumber()
    @Min(0)
    sortOrder?: number;



    @ApiPropertyOptional({
        example: 'cost_center_123',
        description: 'Cost center identifier',
    })
    @IsOptional()
    @IsString()
    costCenterId?: string;



    @ApiPropertyOptional({
        example: 'project_123',
        description: 'Project identifier',
    })
    @IsOptional()
    @IsString()
    projectId?: string;



    @ApiPropertyOptional({
        example: 'currency_123',
        description: 'Currency identifier',
    })
    @IsOptional()
    @IsString()
    currencyId?: string;

}