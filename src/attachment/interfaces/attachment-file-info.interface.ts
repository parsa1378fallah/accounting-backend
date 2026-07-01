export interface AttachmentFileInfo {

    path: string;

    filename: string;

    extension: string;

    exists: boolean;

    size: number;

    metadata?: AttachmentMetadata;

}
export interface AttachmentMetadata {

    etag?: string;

    checksum?: string;

    contentType?: string;

    contentEncoding?: string;

    contentLanguage?: string;

    contentDisposition?: string;

    cacheControl?: string;

    lastModified?: Date;

    storageClass?: string;

    versionId?: string;

    custom?: Record<string, unknown>;

}