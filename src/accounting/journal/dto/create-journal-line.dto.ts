import {
    ApiProperty,
    ApiPropertyOptional,
} from '@nestjs/swagger';

import {
    IsUUID,
    IsOptional,
    IsString,
    IsNumber,
    Min,
    MaxLength,
    ValidateIf,
} from 'class-validator';

import { Type } from 'class-transformer';

export class CreateJournalLineDto {
    @ApiProperty({
        description: 'Ledger account',
        example: 'cm123456789',
    })
    @IsUUID()
    accountId: string;

    @ApiPropertyOptional({
        description: 'Cost Center',
        example: 'cm987654321',
    })
    @IsOptional()
    @IsUUID()
    costCenterId?: string;

    @ApiPropertyOptional({
        description: 'Project',
        example: 'cm555555555',
    })
    @IsOptional()
    @IsUUID()
    projectId?: string;

    @ApiPropertyOptional({
        description: 'Line description',
        maxLength: 500,
        example: 'Purchase office equipment',
    })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    description?: string;

    @ApiProperty({
        description: 'Debit amount',
        example: 1500000,
        default: 0,
    })
    @Type(() => Number)
    @IsNumber({
        maxDecimalPlaces: 4,
    })
    @Min(0)
    debit: number;

    @ApiProperty({
        description: 'Credit amount',
        example: 0,
        default: 0,
    })
    @Type(() => Number)
    @IsNumber({
        maxDecimalPlaces: 4,
    })
    @Min(0)
    credit: number;

    @ApiPropertyOptional({
        description: 'Foreign currency',
        example: 'cmCurrency001',
    })
    @IsOptional()
    @IsUUID()
    currencyId?: string;

    @ApiPropertyOptional({
        description: 'Foreign debit amount',
        example: 100,
    })
    @ValidateIf(o => o.currencyId != null)
    @Type(() => Number)
    @IsNumber({
        maxDecimalPlaces: 4,
    })
    @Min(0)
    foreignDebit?: number;

    @ApiPropertyOptional({
        description: 'Foreign credit amount',
        example: 0,
    })
    @ValidateIf(o => o.currencyId != null)
    @Type(() => Number)
    @IsNumber({
        maxDecimalPlaces: 4,
    })
    @Min(0)
    foreignCredit?: number;

    @ApiPropertyOptional({
        description: 'Exchange rate snapshot',
        example: 42000.123456,
    })
    @ValidateIf(o => o.currencyId != null)
    @Type(() => Number)
    @IsNumber({
        maxDecimalPlaces: 6,
    })
    @Min(0.000001)
    exchangeRateSnapshot?: number;

    @ApiPropertyOptional({
        description: 'Display order',
        example: 1,
        default: 0,
    })
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    sortOrder?: number;
}