import {
  ApiPropertyOptional,
} from '@nestjs/swagger';

import {
  IsBoolean,
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

import { Type } from 'class-transformer';

import { AccountLevel } from '@prisma/client';

export class AccountQueryDto {
  @ApiPropertyOptional({
    example: 1,
  })
  @Type(() => Number)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({
    example: 20,
  })
  @Type(() => Number)
  @IsOptional()
  limit?: number = 20;

  @ApiPropertyOptional({
    example: 'cash',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    example: 'cmf4kzj8q0000x8abc123456',
  })
  @IsOptional()
  @IsString()
  organizationId?: string;

  @ApiPropertyOptional({
    example: 'cmf4kzj8q0000x8abc654321',
  })
  @IsOptional()
  @IsString()
  accountCategoryId?: string;

  @ApiPropertyOptional({
    enum: AccountLevel,
  })
  @IsOptional()
  @IsEnum(AccountLevel)
  level?: AccountLevel;

  @ApiPropertyOptional({
    example: true,
  })
  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    example: 'code',
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'code';

  @ApiPropertyOptional({
    example: 'asc',
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  order?: 'asc' | 'desc' = 'asc';
}