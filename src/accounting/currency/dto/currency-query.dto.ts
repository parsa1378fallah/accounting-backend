import {
    IsIn,
    IsInt,
    IsOptional,
    IsString,
    Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CurrencyQueryDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit = 20;

    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    isActive?: boolean;

    @IsOptional()
    @IsIn([
        'code',
        'name',
        'createdAt',
        'updatedAt',
    ])
    sortBy: string = 'createdAt';

    @IsOptional()
    @IsIn(['asc', 'desc'])
    order: 'asc' | 'desc' = 'desc';
}