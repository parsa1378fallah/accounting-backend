import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FiscalYearClosingResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    organizationId: string;

    @ApiProperty()
    fiscalYearId: string;

    @ApiProperty()
    closingJournalEntryId: string;

    @ApiProperty()
    retainedEarningsAmount: string;

    @ApiProperty()
    closedById: string;

    @ApiProperty()
    closedAt: Date;

    @ApiPropertyOptional()
    notes?: string;

    @ApiProperty()
    createdAt: Date;
}