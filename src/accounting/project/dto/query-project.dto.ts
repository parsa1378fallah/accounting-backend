import { ApiPropertyOptional } from '@nestjs/swagger';

import {
    IsBoolean,
    IsDateString,
    IsEnum,
    IsInt,
    IsOptional,
    IsString,
    Min,
} from 'class-validator';

import { Type } from 'class-transformer';

import { ProjectStatus } from '@prisma/client';

export class QueryProjectDto {

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    organizationId?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({
        enum: ProjectStatus,
    })
    @IsOptional()
    @IsEnum(ProjectStatus)
    status?: ProjectStatus;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    startDateFrom?: Date;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    startDateTo?: Date;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    includeDeleted?: boolean;

    @ApiPropertyOptional({
        default: 1,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page = 1;

    @ApiPropertyOptional({
        default: 20,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit = 20;
}