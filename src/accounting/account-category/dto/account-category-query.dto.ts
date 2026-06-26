import { ApiPropertyOptional } from '@nestjs/swagger';

import {
    IsOptional,
    IsString,
} from 'class-validator';

export class AccountCategoryQueryDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    accountGroupId?: string;
}