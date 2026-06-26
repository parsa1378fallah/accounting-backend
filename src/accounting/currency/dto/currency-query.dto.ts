import {
    IsBooleanString,
    IsIn,
    IsOptional,
    IsString,
} from 'class-validator';

export class CurrencyQueryDto {
    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsBooleanString()
    isActive?: string;

    @IsOptional()
    @IsIn([
        'code',
        'name',
        'createdAt',
    ])
    sortBy?: string = 'createdAt';

    @IsOptional()
    @IsIn([
        'asc',
        'desc',
    ])
    order?: 'asc' | 'desc' = 'desc';

    @IsOptional()
    page?: number = 1;

    @IsOptional()
    limit?: number = 20;
}