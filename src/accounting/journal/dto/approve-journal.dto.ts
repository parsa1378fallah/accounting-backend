import {
    ApiPropertyOptional,
} from '@nestjs/swagger';

import {
    IsOptional,
    IsString,
    MaxLength,
} from 'class-validator';

export class ApproveJournalDto {
    @ApiPropertyOptional({
        description: 'Approval comment',
        example: 'Approved by finance manager',
    })
    @IsOptional()
    @IsString()
    @MaxLength(1000)
    comment?: string;
}