import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsDateString,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
    MaxLength,
} from 'class-validator';

import { ProjectStatus } from '@prisma/client';

export class CreateProjectDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    organizationId: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    code: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    name: string;

    @ApiProperty({
        enum: ProjectStatus,
    })
    @IsEnum(ProjectStatus)
    status: ProjectStatus;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    startDate?: Date;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    endDate?: Date;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    @IsPositive()
    budget?: number;
}