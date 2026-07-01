import { Injectable } from '@nestjs/common';
import { AttachmentMetadata } from '../interfaces/attachment-file-info.interface';



@Injectable()
export class AttachmentMetadataService {

    //--------------------------------------------------
    // Create Metadata
    //--------------------------------------------------

    create(
        metadata?: Partial<AttachmentMetadata>,
    ): AttachmentMetadata {

        return {

            etag:
                metadata?.etag,

            contentType:
                metadata?.contentType,

            lastModified:
                metadata?.lastModified,

            storageClass:
                metadata?.storageClass,

            versionId:
                metadata?.versionId,

            contentEncoding:
                metadata?.contentEncoding,

            contentDisposition:
                metadata?.contentDisposition,

            contentLanguage:
                metadata?.contentLanguage,

            cacheControl:
                metadata?.cacheControl,

            custom:
                metadata?.custom ?? {},

        };

    }

    //--------------------------------------------------
    // Merge Metadata
    //--------------------------------------------------

    merge(
        current: AttachmentMetadata,
        update: Partial<AttachmentMetadata>,
    ): AttachmentMetadata {

        return {

            ...current,

            ...update,

            custom: {

                ...(current.custom ?? {}),

                ...(update.custom ?? {}),

            },

        };

    }

    //--------------------------------------------------
    // Clone Metadata
    //--------------------------------------------------

    clone(
        metadata: AttachmentMetadata,
    ): AttachmentMetadata {

        return structuredClone(metadata);

    }

    //--------------------------------------------------
    // Remove Undefined Values
    //--------------------------------------------------

    clean(
        metadata: AttachmentMetadata,
    ): AttachmentMetadata {

        return Object.fromEntries(

            Object.entries(metadata).filter(

                ([, value]) =>

                    value !== undefined &&
                    value !== null,

            ),

        ) as AttachmentMetadata;

    }

    //--------------------------------------------------
    // Get Custom Value
    //--------------------------------------------------

    getCustomValue<T = unknown>(
        metadata: AttachmentMetadata,
        key: string,
    ): T | undefined {

        return metadata.custom?.[key] as T;

    }

    //--------------------------------------------------
    // Set Custom Value
    //--------------------------------------------------

    setCustomValue(
        metadata: AttachmentMetadata,
        key: string,
        value: unknown,
    ): AttachmentMetadata {

        return {

            ...metadata,

            custom: {

                ...(metadata.custom ?? {}),

                [key]: value,

            },

        };

    }

    //--------------------------------------------------
    // Remove Custom Value
    //--------------------------------------------------

    removeCustomValue(
        metadata: AttachmentMetadata,
        key: string,
    ): AttachmentMetadata {

        const custom = {

            ...(metadata.custom ?? {}),

        };

        delete custom[key];

        return {

            ...metadata,

            custom,

        };

    }

    //--------------------------------------------------
    // Check Empty
    //--------------------------------------------------

    isEmpty(
        metadata?: AttachmentMetadata,
    ): boolean {

        if (!metadata) {
            return true;
        }

        return Object.keys(

            this.clean(metadata),

        ).length === 0;

    }
    //--------------------------------------------------
    // Extract Metadata
    //--------------------------------------------------

    extract(
        source: Record<string, any>,
    ): AttachmentMetadata {

        return this.clean({

            etag:
                source.etag ??
                source.ETag,

            contentType:
                source.contentType ??
                source.ContentType,

            lastModified:
                source.lastModified ??
                source.LastModified,

            storageClass:
                source.storageClass ??
                source.StorageClass,

            versionId:
                source.versionId ??
                source.VersionId,

            contentEncoding:
                source.contentEncoding ??
                source.ContentEncoding,

            contentDisposition:
                source.contentDisposition ??
                source.ContentDisposition,

            contentLanguage:
                source.contentLanguage ??
                source.ContentLanguage,

            cacheControl:
                source.cacheControl ??
                source.CacheControl,

            custom:
                source.custom ?? {},

        });

    }

}