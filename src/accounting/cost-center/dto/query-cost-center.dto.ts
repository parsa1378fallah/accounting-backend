import {
    ApiPropertyOptional,
} from '@nestjs/swagger';

import {
    IsBoolean,
    IsOptional,
    IsString,
    IsUUID,
} from 'class-validator';

export class QueryCostCenterDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsUUID()
    organizationId?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    code?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsUUID()
    parentId?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    search?: string;
}