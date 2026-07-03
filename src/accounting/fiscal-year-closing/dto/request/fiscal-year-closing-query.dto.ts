import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsDate,
    IsInt,
    IsOptional,
    IsString,
    Max,
    Min,
} from 'class-validator';

export class FiscalYearClosingQueryDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    fiscalYearId?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    closedById?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    fromDate?: Date;

    @ApiPropertyOptional()
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    toDate?: Date;

    @ApiPropertyOptional({ default: 1 })
    @Type(() => Number)
    @IsOptional()
    @IsInt()
    @Min(1)
    page = 1;

    @ApiPropertyOptional({ default: 20 })
    @Type(() => Number)
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(100)
    limit = 20;
}