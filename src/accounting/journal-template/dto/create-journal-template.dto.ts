// src/modules/accounting/journal-template/dto/create-journal-template.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsBoolean, IsOptional, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { JournalTemplateType } from '@prisma/client';
import { CreateJournalTemplateLineDto } from './create-journal-template-line.dto';

export class CreateJournalTemplateDto {
    @ApiProperty({ description: 'نام قالب' })
    @IsString()
    name: string;

    @ApiProperty({ enum: JournalTemplateType, description: 'نوع قالب' })
    @IsEnum(JournalTemplateType)
    type: JournalTemplateType;

    @ApiPropertyOptional({ description: 'توضیحات قالب' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ description: 'آیا فعال باشد' })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean = true;

    @ApiProperty({ description: 'خطوط قالب', type: [CreateJournalTemplateLineDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateJournalTemplateLineDto)
    lines: CreateJournalTemplateLineDto[];
}