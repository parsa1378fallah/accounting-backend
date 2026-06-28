import {
    ApiProperty,
    ApiPropertyOptional,
} from '@nestjs/swagger';

import {
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
    Min,
} from 'class-validator';

export class CreateRealizedFxDto {
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

    @ApiProperty()
    @IsNumber()
    @Min(0)
    foreignAmount: number;

    @ApiProperty()
    @IsNumber()
    @Min(0)
    originalRate: number;

    @ApiProperty()
    @IsNumber()
    @Min(0)
    settlementRate: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    referenceType?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    referenceId?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    description?: string;
}