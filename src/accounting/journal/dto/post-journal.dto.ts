import {
    ApiPropertyOptional,
} from '@nestjs/swagger';

import {
    IsOptional,
    IsString,
    MaxLength,
} from 'class-validator';

export class PostJournalDto {
    @ApiPropertyOptional({
        description: 'Posting notes',
        example: 'Posted after final verification',
    })
    @IsOptional()
    @IsString()
    @MaxLength(1000)
    notes?: string;
}