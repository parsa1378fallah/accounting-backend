// src/modules/accounting/journal-template/entities/journal-template-line.entity.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TemplateAmountType } from '@prisma/client';

export class JournalTemplateLineEntity {
    @ApiProperty()
    id: string;

    @ApiProperty()
    templateId: string;

    @ApiProperty()
    accountId: string;

    @ApiProperty()
    accountName?: string; // برای نمایش بهتر در پاسخ

    @ApiProperty()
    isDebit: boolean;

    @ApiProperty({ enum: TemplateAmountType })
    amountType: TemplateAmountType;

    @ApiPropertyOptional()
    amount?: number;

    @ApiPropertyOptional()
    percentage?: number;

    @ApiPropertyOptional()
    description?: string;

    @ApiProperty()
    sortOrder: number;

    @ApiPropertyOptional()
    costCenterId?: string;

    @ApiPropertyOptional()
    costCenterName?: string;

    @ApiPropertyOptional()
    projectId?: string;

    @ApiPropertyOptional()
    projectName?: string;

    @ApiPropertyOptional()
    currencyId?: string;

    @ApiProperty()
    createdAt: Date;
}