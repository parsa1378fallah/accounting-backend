import {
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';

import {
    CopyObjectCommand,
    DeleteObjectCommand,
    GetObjectCommand,
    HeadObjectCommand,
    PutObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3';

import { Readable } from 'stream';


import { IAttachmentStorageProvider } from 'src/attachment/interfaces/attachment-storage.provider.interface';
import { streamToBuffer } from 'src/attachment/utils/stream.util';
import { AttachmentFileInfo } from 'src/attachment/interfaces/attachment-file-info.interface';



@Injectable()
export class S3StorageProvider
    implements IAttachmentStorageProvider {

    private readonly s3 = new S3Client({

        region: process.env.AWS_REGION,

        credentials: {

            accessKeyId:
                process.env.AWS_ACCESS_KEY_ID!,

            secretAccessKey:
                process.env.AWS_SECRET_ACCESS_KEY!,

        },

    });

    private readonly bucket =
        process.env.S3_BUCKET!;

    //--------------------------------------------------
    // Save
    //--------------------------------------------------

    async save(
        path: string,
        buffer: Buffer,
    ): Promise<void> {

        await this.s3.send(

            new PutObjectCommand({

                Bucket: this.bucket,

                Key: path,

                Body: buffer,

            }),

        );

    }

    //--------------------------------------------------
    // Read
    //--------------------------------------------------

    async read(
        path: string,
    ): Promise<Buffer> {

        const response =
            await this.s3.send(

                new GetObjectCommand({

                    Bucket: this.bucket,

                    Key: path,

                }),

            );

        if (!response.Body) {

            throw new InternalServerErrorException(
                'Unable to read object.',
            );

        }

        return streamToBuffer(
            response.Body as Readable,
        );

    }

    //--------------------------------------------------
    // Stream
    //--------------------------------------------------

    async createReadStream(
        path: string,
    ): Promise<Readable> {

        const response =
            await this.s3.send(

                new GetObjectCommand({

                    Bucket: this.bucket,

                    Key: path,

                }),

            );

        if (!response.Body) {

            throw new InternalServerErrorException(
                'Unable to stream object.',
            );

        }

        return response.Body as Readable;

    }

    //--------------------------------------------------
    // Partial Stream
    //--------------------------------------------------

    async readPartial(

        path: string,

        start: number,

        end: number,

    ): Promise<Readable> {

        const response =
            await this.s3.send(

                new GetObjectCommand({

                    Bucket: this.bucket,

                    Key: path,

                    Range: `bytes=${start}-${end}`,

                }),

            );

        if (!response.Body) {

            throw new InternalServerErrorException(
                'Unable to stream object.',
            );

        }

        return response.Body as Readable;

    }

    //--------------------------------------------------
    // Delete
    //--------------------------------------------------

    async delete(
        path: string,
    ): Promise<void> {

        await this.s3.send(

            new DeleteObjectCommand({

                Bucket: this.bucket,

                Key: path,

            }),

        );

    }

    //--------------------------------------------------
    // Exists
    //--------------------------------------------------

    async exists(
        path: string,
    ): Promise<boolean> {

        try {

            await this.s3.send(

                new HeadObjectCommand({

                    Bucket: this.bucket,

                    Key: path,

                }),

            );

            return true;

        }

        catch {

            return false;

        }

    }

    //--------------------------------------------------
    // Copy
    //--------------------------------------------------

    async copy(

        source: string,

        destination: string,

    ): Promise<void> {

        await this.s3.send(

            new CopyObjectCommand({

                Bucket: this.bucket,

                CopySource:
                    `${this.bucket}/${source}`,

                Key: destination,

            }),

        );

    }

    //--------------------------------------------------
    // Move
    //--------------------------------------------------

    async move(

        source: string,

        destination: string,

    ): Promise<void> {

        await this.copy(

            source,

            destination,

        );

        await this.delete(source);

    }

    //--------------------------------------------------
    // Rename
    //--------------------------------------------------

    async rename(

        source: string,

        filename: string,

    ): Promise<string> {

        const parts =
            source.split('/');

        parts.pop();

        const destination =
            [...parts, filename].join('/');

        await this.move(

            source,

            destination,

        );

        return destination;

    }

    //--------------------------------------------------
    // Info
    //--------------------------------------------------

    async getInfo(
        path: string,
    ): Promise<AttachmentFileInfo> {

        const response =
            await this.s3.send(

                new HeadObjectCommand({

                    Bucket: this.bucket,

                    Key: path,

                }),

            );

        return {

            path,

            filename:
                path.split('/').pop() ?? '',

            extension:
                path.split('.').pop() ?? '',

            exists: true,

            size:
                response.ContentLength ?? 0,

            metadata: {

                etag:
                    response.ETag,

                checksum:
                    response.ChecksumSHA256,

                contentType:
                    response.ContentType,

                contentEncoding:
                    response.ContentEncoding,

                contentLanguage:
                    response.ContentLanguage,

                contentDisposition:
                    response.ContentDisposition,

                cacheControl:
                    response.CacheControl,

                lastModified:
                    response.LastModified,

                storageClass:
                    response.StorageClass,

                versionId:
                    response.VersionId,

                custom:
                    response.Metadata,

            },

        };

    }

}