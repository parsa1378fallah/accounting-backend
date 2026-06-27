import { IsDateString, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExchangeRateDto {
    @ApiProperty()
    @IsString()
    currencyId: string;

    @ApiProperty()
    @IsNumber()
    @Min(0)
    rate: number;

    @ApiProperty()
    @IsDateString()
    effectiveDate: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    source?: string;
}