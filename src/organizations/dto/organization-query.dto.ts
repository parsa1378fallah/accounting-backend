import {
    IsBooleanString,
    IsEnum,
    IsInt,
    IsOptional,
    IsString,
    Min,
} from 'class-validator';

import { Type } from 'class-transformer';

export enum SortOrder {
    ASC = 'asc',
    DESC = 'desc',
}

export class OrganizationQueryDto {
    // =========================
    // Pagination
    // =========================

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number = 20;

    // =========================
    // Search
    // =========================

    @IsOptional()
    @IsString()
    search?: string;

    // =========================
    // Filter
    // =========================

    @IsOptional()
    @IsBooleanString()
    isActive?: boolean | string;

    // =========================
    // Sorting
    // =========================

    @IsOptional()
    @IsString()
    sortBy?: string = 'createdAt';

    @IsOptional()
    @IsEnum(SortOrder)
    order?: SortOrder = SortOrder.DESC;
}