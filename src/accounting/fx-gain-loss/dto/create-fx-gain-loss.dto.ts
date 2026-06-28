import {
    IsString,
    IsOptional,
    IsEnum,
    IsUUID,
    IsNumber,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import {
    FxDirection,
    FxEntryType,
} from '@prisma/client';

export class CreateFxGainLossDto {
    @ApiProperty()
    @IsUUID()
    organizationId: string;

    @ApiProperty()
    @IsUUID()
    journalEntryId: string;

    @ApiProperty()
    @IsUUID()
    currencyId: string;

    @ApiProperty()
    @IsUUID()
    baseCurrencyId: string;

    @ApiProperty({
        enum: FxEntryType,
    })
    @IsEnum(FxEntryType)
    entryType: FxEntryType;

    @ApiProperty({
        enum: FxDirection,
    })
    @IsEnum(FxDirection)
    direction: FxDirection;

    @ApiProperty()
    @IsNumber()
    amount: number;

    @ApiProperty()
    @IsNumber()
    exchangeRate: number;

    @ApiProperty()
    @IsNumber()
    sourceAmount: number;

    @ApiProperty({
        required: false,
    })
    @IsOptional()
    @IsString()
    referenceType?: string;

    @ApiProperty({
        required: false,
    })
    @IsOptional()
    @IsString()
    referenceId?: string;

    @ApiProperty({
        required: false,
    })
    @IsOptional()
    @IsString()
    description?: string;
}