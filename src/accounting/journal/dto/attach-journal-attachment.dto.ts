import {
    ApiProperty,
} from '@nestjs/swagger';

import {
    IsUUID,
    IsString,
} from 'class-validator';

export class AttachJournalAttachmentDto {

    @ApiProperty({
        example: 'cm123456789',
    })
    @IsString()
    attachmentId: string;
}