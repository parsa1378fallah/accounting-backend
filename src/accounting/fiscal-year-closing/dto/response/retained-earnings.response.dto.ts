import { ApiProperty } from '@nestjs/swagger';

export class RetainedEarningsResponseDto {
    @ApiProperty({
        description: 'Total revenue.',
        example: '1250000.0000',
    })
    totalRevenue: string;

    @ApiProperty({
        description: 'Total expenses.',
        example: '820000.0000',
    })
    totalExpense: string;

    @ApiProperty({
        description: 'Net income.',
        example: '430000.0000',
    })
    netIncome: string;

    @ApiProperty({
        description: 'Retained earnings amount.',
        example: '430000.0000',
    })
    retainedEarningsAmount: string;
}