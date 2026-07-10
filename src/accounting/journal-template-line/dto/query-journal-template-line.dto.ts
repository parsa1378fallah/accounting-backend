import { ApiPropertyOptional } from '@nestjs/swagger';

import {
    IsBoolean,
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
    Min,
} from 'class-validator';

import { Type } from 'class-transformer';

import { TemplateAmountType }
    from '../domain/enums/template-amount-type.enum';



export class QueryJournalTemplateLineDto {


    @ApiPropertyOptional({
        example: 'org_123',
        description: 'Filter by organization',
    })
    @IsOptional()
    @IsString()
    organizationId?: string;



    @ApiPropertyOptional({
        example: 'template_123',
        description: 'Filter by journal template',
    })
    @IsOptional()
    @IsString()
    templateId?: string;



    @ApiPropertyOptional({
        example: 'account_123',
        description: 'Filter by account',
    })
    @IsOptional()
    @IsString()
    accountId?: string;



    @ApiPropertyOptional({
        enum: TemplateAmountType,
        example: TemplateAmountType.FIXED,
    })
    @IsOptional()
    @IsEnum(TemplateAmountType)
    amountType?: TemplateAmountType;



    @ApiPropertyOptional({
        example: true,
        description: 'Debit or Credit filter',
    })
    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    isDebit?: boolean;



    @ApiPropertyOptional({
        example: 1,
        default: 1,
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    page?: number = 1;



    @ApiPropertyOptional({
        example: 20,
        default: 20,
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    limit?: number = 20;



    @ApiPropertyOptional({
        example: 'sortOrder',
        default: 'sortOrder',
        description: 'Sorting field',
    })
    @IsOptional()
    @IsString()
    sortBy?: string;



    @ApiPropertyOptional({
        example: 'asc',
        enum: ['asc', 'desc'],
    })
    @IsOptional()
    @IsString()
    sortOrder?: 'asc' | 'desc';

}