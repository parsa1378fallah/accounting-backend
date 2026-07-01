import {
    ApiProperty,
} from '@nestjs/swagger';

import {
    ArrayUnique,
    IsArray,
    IsString,
} from 'class-validator';

export class ReplaceJournalAttachmentsDto {

    @ApiProperty({
        type: [String],
    })
    @IsArray()

    @ArrayUnique()

    @IsString({
        each: true,
    })
    attachmentIds: string[];
}