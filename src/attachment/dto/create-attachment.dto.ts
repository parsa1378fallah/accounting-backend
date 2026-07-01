import {
    IsBoolean,
    IsInt,
    IsOptional,
    IsString,
    IsUUID,
    Min,
} from 'class-validator';

export class CreateAttachmentDto {
    @IsString()
    organizationId: string;

    @IsString()
    fileName: string;

    @IsString()
    originalName: string;

    @IsString()
    extension: string;

    @IsString()
    mimeType: string;

    @IsInt()
    @Min(0)
    size: number;

    @IsString()
    path: string;

    @IsOptional()
    @IsString()
    disk?: string;

    @IsOptional()
    @IsString()
    checksum?: string;

    @IsOptional()
    @IsBoolean()
    isPublic?: boolean;

    @IsOptional()
    @IsString()
    uploadedById?: string;
}