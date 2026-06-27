import { IsOptional, IsString, IsNumberString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ExchangeRateQueryDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    currencyId?: string;

    @ApiPropertyOptional()
    @IsOptional()
    fromDate?: string;

    @ApiPropertyOptional()
    @IsOptional()
    toDate?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
    page?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
    limit?: number;

    @ApiPropertyOptional()
    @IsOptional()
    search?: string;

    @ApiPropertyOptional()
    @IsOptional()
    sortBy?: string;

    @ApiPropertyOptional()
    @IsOptional()
    sortOrder?: 'asc' | 'desc';
}