export class AttachmentResponseDto {
    id: string;

    organizationId: string;

    fileName: string;

    originalName: string;

    extension: string;

    mimeType: string;

    size: number;

    path: string;

    disk?: string;

    checksum?: string;

    isPublic: boolean;

    uploadedById?: string;

    createdAt: Date;

    updatedAt: Date;

    deletedAt?: Date | null;
}