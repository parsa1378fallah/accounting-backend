import { ApiProperty } from '@nestjs/swagger';
import { TemplateAmountType } from '@prisma/client'

export class JournalTemplateLineResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    templateId: string;

    @ApiProperty()
    accountId: string;

    @ApiProperty({ required: false })
    accountName?: string;

    @ApiProperty({ required: false })
    costCenterId?: string;

    @ApiProperty({ required: false })
    costCenterName?: string;

    @ApiProperty({ required: false })
    projectId?: string;

    @ApiProperty({ required: false })
    projectName?: string;

    @ApiProperty({ required: false })
    currencyId?: string;

    @ApiProperty({ required: false })
    currencyCode?: string;

    @ApiProperty()
    organizationId: string;

    @ApiProperty()
    isDebit: boolean;

    @ApiProperty({
        enum: TemplateAmountType,
    })
    amountType: TemplateAmountType;

    @ApiProperty({
        required: false,
    })
    amount?: number;

    @ApiProperty({
        required: false,
    })
    percentage?: string;

    @ApiProperty({
        required: false,
    })
    formula?: {
        expression: string;
    };

    @ApiProperty({
        required: false,
    })
    description?: string;

    @ApiProperty()
    sortOrder: number;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty({
        required: false,
    })
    deletedAt?: Date;

    @ApiProperty()
    version: number;
}