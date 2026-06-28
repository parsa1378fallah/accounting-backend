import {
    IsOptional,
    IsUUID,
    IsEnum,
    IsString,
    IsInt,
    Min,
} from 'class-validator';

import { Type } from 'class-transformer';

import {
    FxDirection,
    FxEntryType,
} from '@prisma/client';

export class QueryFxGainLossDto {
    @IsOptional()
    @IsUUID()
    organizationId?: string;

    @IsOptional()
    @IsUUID()
    journalEntryId?: string;

    @IsOptional()
    @IsUUID()
    currencyId?: string;

    @IsOptional()
    @IsEnum(FxEntryType)
    entryType?: FxEntryType;

    @IsOptional()
    @IsEnum(FxDirection)
    direction?: FxDirection;

    @IsOptional()
    @IsString()
    referenceType?: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number = 20;
}