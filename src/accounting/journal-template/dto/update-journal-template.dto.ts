// src/modules/accounting/journal-template/dto/update-journal-template.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsBoolean, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { JournalTemplateType } from '@prisma/client';
import { CreateJournalTemplateLineDto } from './create-journal-template-line.dto';

export class UpdateJournalTemplateDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ enum: JournalTemplateType })
    @IsOptional()
    @IsEnum(JournalTemplateType)
    type?: JournalTemplateType;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @ApiPropertyOptional({ type: [CreateJournalTemplateLineDto] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateJournalTemplateLineDto)
    lines?: CreateJournalTemplateLineDto[];
}