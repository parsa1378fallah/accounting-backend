import { ApiProperty } from '@nestjs/swagger';
import { FiscalYearClosingResponseDto } from './fiscal-year-closing.response.dto';

export class FiscalYearClosingListResponseDto {
    @ApiProperty({
        type: [FiscalYearClosingResponseDto],
    })
    items: FiscalYearClosingResponseDto[];

    @ApiProperty()
    total: number;

    @ApiProperty()
    page: number;

    @ApiProperty()
    limit: number;
}