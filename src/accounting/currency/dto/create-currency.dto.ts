import {
    IsBoolean,
    IsInt,
    IsOptional,
    IsString,
    Length,
    Max,
    Min,
} from 'class-validator';

export class CreateCurrencyDto {
    @IsString()
    @Length(2, 10)
    code: string;

    @IsString()
    @Length(2, 100)
    name: string;

    @IsString()
    @Length(1, 10)
    symbol: string;

    @IsOptional()
    @IsBoolean()
    isBase?: boolean;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(8)
    decimalPlaces?: number;
}