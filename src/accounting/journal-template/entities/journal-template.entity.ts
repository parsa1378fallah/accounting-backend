// src/modules/accounting/journal-template/entities/journal-template.entity.ts
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { JournalTemplateType } from '@prisma/client';
import { JournalTemplateLineEntity } from './journal-template-line.entity';
import { Exclude, Type } from 'class-transformer';

export class JournalTemplateEntity {
    @ApiProperty()
    id: string;

    @ApiProperty()
    organizationId: string;

    @ApiProperty()
    name: string;

    @ApiProperty({ enum: JournalTemplateType })
    type: JournalTemplateType;

    @ApiProperty({ required: false })
    description?: string;

    @ApiProperty()
    isActive: boolean;

    @ApiProperty()
    isSystem: boolean;

    @ApiProperty({ required: false })
    createdById?: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty({ required: false })
    deletedAt?: Date;

    @ApiProperty({ type: [JournalTemplateLineEntity] })
    @Type(() => JournalTemplateLineEntity)
    lines: JournalTemplateLineEntity[];

    // فیلدهای حساس را مخفی می‌کنیم
    @ApiHideProperty()
    @Exclude()
    organization?: any;
}