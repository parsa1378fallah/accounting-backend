import { ApiPropertyOptional } from '@nestjs/swagger';
import { SystemAccountKey } from '@prisma/client';

import {
    IsBoolean,
    IsEnum,
    IsIn,
    IsInt,
    IsOptional,
    IsPositive,
    IsString,
    Max,
    Min,
} from 'class-validator';

import { Type } from 'class-transformer';

export class SystemAccountQueryDto {
    @ApiPropertyOptional({
        description: 'Organization ID',
        example: 'cmc123abc456xyz789',
    })
    @IsOptional()
    @IsString()
    organizationId?: string;

    @ApiPropertyOptional({
        description: 'Search by account code, account name or key',
        example: 'cash',
    })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({
        description: 'Filter by system account key',
        enum: SystemAccountKey,
    })
    @IsOptional()
    @IsEnum(SystemAccountKey)
    key?: SystemAccountKey;

    @ApiPropertyOptional({
        description: 'Filter by account id',
        example: 'cmc456def789ghi123',
    })
    @IsOptional()
    @IsString()
    accountId?: string;

    @ApiPropertyOptional({
        description: 'Page number',
        example: 1,
        default: 1,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page: number = 1;

    @ApiPropertyOptional({
        description: 'Items per page',
        example: 20,
        default: 20,
        maximum: 100,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    @Max(100)
    limit: number = 20;

    @ApiPropertyOptional({
        description: 'Sort field',
        enum: ['key', 'createdAt'],
        default: 'key',
    })
    @IsOptional()
    @IsIn([
        'key',
        'createdAt',
    ])
    sortBy: 'key' | 'createdAt' = 'key';

    @ApiPropertyOptional({
        description: 'Sort direction',
        enum: ['asc', 'desc'],
        default: 'asc',
    })
    @IsOptional()
    @IsIn([
        'asc',
        'desc',
    ])
    order: 'asc' | 'desc' = 'asc';
    @IsOptional()
    @IsBoolean()
    isActive: boolean
}