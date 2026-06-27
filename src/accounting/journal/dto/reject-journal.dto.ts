import {
    ApiProperty,
} from '@nestjs/swagger';

import {
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';

export class RejectJournalDto {
    @ApiProperty({
        description: 'Reason for rejection',
        example: 'Debit and credit do not match supporting documents.',
    })
    @IsString()
    @MinLength(5)
    @MaxLength(1000)
    reason: string;
}