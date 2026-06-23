import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';
import { CreateFiscalYearDto } from './create-fiscal-year.dto';

export class UpdateFiscalYearDto extends PartialType(CreateFiscalYearDto) {
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    startAt?: Date;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    endAt?: Date;
}