// src/modules/accounting/journal-template/dto/journal-template-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { JournalTemplateType } from '@prisma/client';

export class JournalTemplateLineResponseDto {
    id: string;
    accountId: string;
    accountName: string;
    isDebit: boolean;
    amountType: string;
    amount?: number;
    percentage?: number;
    description?: string;
    sortOrder: number;
}

export class JournalTemplateResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty({ enum: JournalTemplateType })
    type: JournalTemplateType;

    @ApiProperty()
    description?: string;

    @ApiProperty()
    isActive: boolean;

    @ApiProperty({ type: [JournalTemplateLineResponseDto] })
    lines: JournalTemplateLineResponseDto[];

    createdAt: Date;
    updatedAt: Date;
}