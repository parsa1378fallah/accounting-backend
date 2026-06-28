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

export class CreateUnrealizedFxDto {
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
    bookRate: number;

    @ApiProperty()
    @IsNumber()
    @Min(0)
    currentRate: number;

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