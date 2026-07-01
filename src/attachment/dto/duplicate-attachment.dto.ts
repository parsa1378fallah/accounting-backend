import { IsString } from 'class-validator';

export class DuplicateAttachmentDto {
    @IsString()
    targetEntityId: string;
}
