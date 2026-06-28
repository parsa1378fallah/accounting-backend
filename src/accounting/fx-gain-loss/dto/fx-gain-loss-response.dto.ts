import { ApiProperty } from '@nestjs/swagger';

import {
    FxDirection,
    FxEntryType,
} from '@prisma/client';

export class FxGainLossResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    organizationId: string;

    @ApiProperty()
    journalEntryId: string;

    @ApiProperty()
    currencyId: string;

    @ApiProperty()
    baseCurrencyId: string;

    @ApiProperty({
        enum: FxEntryType,
    })
    entryType: FxEntryType;

    @ApiProperty({
        enum: FxDirection,
    })
    direction: FxDirection;

    @ApiProperty()
    amount: number;

    @ApiProperty()
    exchangeRate: number;

    @ApiProperty()
    sourceAmount: number;

    @ApiProperty({
        required: false,
    })
    referenceType?: string;

    @ApiProperty({
        required: false,
    })
    referenceId?: string;

    @ApiProperty({
        required: false,
    })
    description?: string;

    @ApiProperty()
    createdAt: Date;
}