import { Type } from 'class-transformer';
import { IsDate, IsString, MaxLength } from 'class-validator';

export class CreateFiscalYearDto {
    @IsString()
    @MaxLength(100)
    name: string;

    @Type(() => Date)
    @IsDate()
    startAt: Date;

    @Type(() => Date)
    @IsDate()
    endAt: Date;
}