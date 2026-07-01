import {
    IsBoolean,
    IsInt,
    IsOptional,
    IsString,
    Min,
} from 'class-validator';

import { Type } from 'class-transformer';

export class QueryAttachmentDto {
    @IsOptional()
    @IsString()
    organizationId?: string;

    @IsOptional()
    @IsString()
    mimeType?: string;

    @IsOptional()
    @IsString()
    extension?: string;

    @IsOptional()
    @IsString()
    search?: string;

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

    @IsOptional()
    @IsBoolean()
    includeDeleted?: boolean = false;
}