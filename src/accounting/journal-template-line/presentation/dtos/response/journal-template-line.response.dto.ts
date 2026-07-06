import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Decimal } from 'decimal.js';

export class FormulaDto {
    @ApiProperty({
        description: 'Formula expression',
        example: '($baseAmount * 10) / 100',
    })
    expression: string;

    @ApiPropertyOptional({
        description: 'Formula variables',
        example: ['$baseAmount'],
    })
    variables?: string[];
}

export class JournalTemplateLineResponseDto {
    @ApiProperty({
        description: 'Line ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    id: string;

    @ApiProperty({
        description: 'Template ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    templateId: string;

    @ApiProperty({
        description: 'Account ID',
        example: '550e8400-e29b-41d4-a716-446655440001',
    })
    accountId: string;

    @ApiPropertyOptional({
        description: 'Cost Center ID',
    })
    costCenterId?: string;

    @ApiPropertyOptional({
        description: 'Project ID',
    })
    projectId?: string;

    @ApiPropertyOptional({
        description: 'Currency ID',
    })
    currencyId?: string;

    @ApiProperty({
        description: 'Organization ID',
    })
    organizationId: string;

    @ApiProperty({
        description: 'Is Debit Entry',
        example: true,
    })
    isDebit: boolean;

    @ApiProperty({
        description: 'Amount Type',
        enum: ['FIXED', 'PERCENTAGE', 'FORMULA'],
        example: 'FIXED',
    })
    amountType: string;

    @ApiPropertyOptional({
        description: 'Fixed Amount',
        example: '1000.0000',
    })
    amount?: number;

    @ApiPropertyOptional({
        description: 'Percentage',
        example: '10.00',
    })
    percentage?: string;

    @ApiPropertyOptional({
        description: 'Formula',
        type: FormulaDto,
    })
    formula?: FormulaDto;

    @ApiPropertyOptional({
        description: 'Description',
        example: 'Main revenue account',
    })
    description?: string;

    @ApiProperty({
        description: 'Sort Order',
        example: 0,
    })
    sortOrder: number;

    @ApiProperty({
        description: 'Created At',
        example: '2024-01-01T00:00:00Z',
    })
    createdAt: Date;

    @ApiProperty({
        description: 'Updated At',
        example: '2024-01-01T00:00:00Z',
    })
    updatedAt: Date;

    @ApiPropertyOptional({
        description: 'Deleted At',
        example: '2024-01-01T00:00:00Z',
    })
    deletedAt?: Date | null;

    @ApiProperty({
        description: 'Version',
        example: 1,
    })
    version: number;
}