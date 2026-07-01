import { Injectable } from '@nestjs/common';

import { Client } from 'minio';
import { AttachmentFileInfo } from 'src/attachment/interfaces/attachment-file-info.interface';
import { IAttachmentStorageProvider } from 'src/attachment/interfaces/attachment-storage.provider.interface';
import { Readable } from 'stream';


@Injectable()
export class MinioStorageProvider
    implements IAttachmentStorageProvider {

    private client = new Client({
        endPoint: process.env.MINIO_ENDPOINT!,
        port: Number(process.env.MINIO_PORT!),
        useSSL: false,
        accessKey: process.env.MINIO_ACCESS_KEY!,
        secretKey: process.env.MINIO_SECRET_KEY!,
    });

    private bucket = process.env.MINIO_BUCKET!;

    async save(path: string, buffer: Buffer) {

        await this.client.putObject(
            this.bucket,
            path,
            buffer,
        );
    }

    async read(path: string) {

        const stream = await this.client.getObject(
            this.bucket,
            path,
        );

        return stream as any;
    }

    async delete(path: string) {

        await this.client.removeObject(
            this.bucket,
            path,
        );
    }

    async exists(path: string) {

        try {

            await this.client.statObject(
                this.bucket,
                path,
            );

            return true;

        } catch {
            return false;
        }
    }

    async move(source: string, destination: string) {

        await this.copy(source, destination);
        await this.delete(source);
    }

    async copy(source: string, destination: string) {

        await this.client.copyObject(
            this.bucket,
            destination,
            `${this.bucket}/${source}`,
        );
    }

    createReadStream(path: string) {

        return this.client.getObject(
            this.bucket,
            path,
        ) as any;
    }

    readPartial(): Promise<Readable> {
        throw new Error('MinIO supports range via options — can be extended later');
    }

    async getInfo(path: string): Promise<AttachmentFileInfo> {

        const stat = await this.client.statObject(
            this.bucket,
            path,
        );

        return {
            path,
            filename: path.split('/').pop() || '',
            extension: '',
            exists: true,
            size: stat.size,
            metadata: {

                etag: stat.etag,

                lastModified: stat.lastModified,

                versionId: stat.versionId ?? undefined,

                contentType: stat.metaData?.['content-type'],

            },
        };
    }
}