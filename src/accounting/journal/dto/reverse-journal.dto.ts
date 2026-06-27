import {
    ApiProperty,
    ApiPropertyOptional,
} from '@nestjs/swagger';

import {
    IsDateString,
    IsOptional,
    IsString,
    MaxLength,
} from 'class-validator';

export class ReverseJournalDto {
    @ApiProperty({
        description: 'Reversal date',
        example: '2026-06-30',
    })
    @IsDateString()
    reversalDate: string;

    @ApiPropertyOptional({
        description: 'Reason for reversal',
        example: 'Incorrect account selection',
    })
    @IsOptional()
    @IsString()
    @MaxLength(1000)
    reason?: string;
}