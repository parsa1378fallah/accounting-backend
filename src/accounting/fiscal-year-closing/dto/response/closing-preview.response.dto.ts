import { ApiProperty } from '@nestjs/swagger';

export class ClosingPreviewResponseDto {
    @ApiProperty()
    fiscalYearId: string;

    @ApiProperty()
    totalRevenue: string;

    @ApiProperty()
    totalExpense: string;

    @ApiProperty()
    netIncome: string;

    @ApiProperty()
    retainedEarningsAmount: string;

    @ApiProperty()
    draftJournalEntries: number;

    @ApiProperty()
    pendingJournalApprovals: number;

    @ApiProperty()
    unbalancedJournalEntries: number;

    @ApiProperty()
    canClose: boolean;

    @ApiProperty({
        type: [String],
    })
    warnings: string[];
}