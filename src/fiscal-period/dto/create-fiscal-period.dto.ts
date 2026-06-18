import {
    IsDateString,
    IsOptional,
    IsString,
    MaxLength,
} from 'class-validator';

export class CreateFiscalPeriodDto {
    @IsString()
    @MaxLength(100)
    @IsOptional()
    name?: string;

    @IsDateString()
    startDate: string;

    @IsDateString()
    endDate: string;

    @IsString()
    fiscalYearId: string;
}