import { ApiProperty } from '@nestjs/swagger';

export class CalculationResultDto {
    @ApiProperty({
        description: 'Line ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    lineId: string;

    @ApiProperty({
        description: 'Calculated Amount',
        example: '1000.0000',
    })
    amount: string;

    @ApiProperty({
        description: 'Is Debit',
        example: true,
    })
    isDebit: boolean;

    @ApiProperty({
        description: 'Formula used',
        example: '($baseAmount * 10) / 100',
    })
    formula?: string;

    @ApiProperty({
        description: 'Formula variables used',
        example: { $baseAmount: '10000.0000' },
    })
    variables?: Record<string, string>;

    @ApiProperty({
        description: 'Calculation timestamp',
        example: '2024-01-01T00:00:00Z',
    })
    calculatedAt: Date;
}

export class CalculationPreviewResponseDto {
    @ApiProperty({
        description: 'Calculation results for each line',
        type: [CalculationResultDto],
    })
    results: CalculationResultDto[];

    @ApiProperty({
        description: 'Total Debit Amount',
        example: '10000.0000',
    })
    totalDebit: string;

    @ApiProperty({
        description: 'Total Credit Amount',
        example: '10000.0000',
    })
    totalCredit: string;

    @ApiProperty({
        description: 'Is balanced (Debit = Credit)',
        example: true,
    })
    isBalanced: boolean;

    @ApiProperty({
        description: 'Calculation time in milliseconds',
        example: 150,
    })
    calculationTime: number;
}