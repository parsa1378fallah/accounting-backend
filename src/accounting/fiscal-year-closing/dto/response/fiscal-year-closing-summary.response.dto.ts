import { ApiProperty } from "@nestjs/swagger";

export class FiscalYearClosingSummaryResponseDto {
    @ApiProperty()
    fiscalYearId: string;

    @ApiProperty()
    fiscalYearName: string;

    @ApiProperty()
    retainedEarningsAmount: string;

    @ApiProperty()
    closedAt: Date;

    @ApiProperty()
    closedById: string;

    @ApiProperty()
    closedByName: string;

    @ApiProperty()
    closingJournalEntryId: string;

    @ApiProperty()
    closingJournalEntryNumber: string;

    @ApiProperty()
    affectedJournalEntries: number;

}