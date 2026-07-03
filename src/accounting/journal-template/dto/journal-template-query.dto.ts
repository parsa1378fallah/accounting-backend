// src/modules/accounting/journal-template/dto/journal-template-query.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsBoolean } from 'class-validator';
import { JournalTemplateType } from '@prisma/client';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

export class JournalTemplateQueryDto extends PaginationQueryDto {
    @ApiPropertyOptional({ enum: JournalTemplateType })
    @IsOptional()
    @IsEnum(JournalTemplateType)
    type?: JournalTemplateType;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    accountId?: string;
}
