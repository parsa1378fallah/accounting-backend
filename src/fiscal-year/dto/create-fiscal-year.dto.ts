import {
    IsDateString,
    IsString,
    MaxLength,
} from 'class-validator';

export class CreateFiscalYearDto {
    @IsString()
    @MaxLength(100)
    name: string;

    @IsDateString()
    startAt: string;

    @IsDateString()
    endAt: string;
}