import { Injectable } from '@nestjs/common';
import { BlobServiceClient } from '@azure/storage-blob';
import { Readable } from 'stream';

import { IAttachmentStorageProvider } from 'src/attachment/interfaces/attachment-storage.provider.interface';
import { AttachmentFileInfo } from 'src/attachment/interfaces/attachment-file-info.interface';

@Injectable()
export class AzureStorageProvider
    implements IAttachmentStorageProvider {

    private client = BlobServiceClient.fromConnectionString(
        process.env.AZURE_STORAGE_CONNECTION_STRING!,
    );

    private container = this.client.getContainerClient(
        process.env.AZURE_CONTAINER!,
    );

    async save(path: string, buffer: Buffer) {

        const blob = this.container.getBlockBlobClient(path);

        await blob.uploadData(buffer);
    }

    async read(path: string) {

        const blob = this.container.getBlockBlobClient(path);

        const res = await blob.download();

        return Buffer.from(
            await this.streamToBuffer(res.readableStreamBody),
        );
    }

    async delete(path: string) {

        const blob = this.container.getBlockBlobClient(path);

        await blob.deleteIfExists();
    }

    async exists(path: string) {

        const blob = this.container.getBlockBlobClient(path);

        return await blob.exists();
    }

    async move(source: string, destination: string) {

        await this.copy(source, destination);
        await this.delete(source);
    }

    async copy(source: string, destination: string) {

        const sourceBlob =
            this.container.getBlockBlobClient(source);

        const destBlob =
            this.container.getBlockBlobClient(destination);

        await destBlob.beginCopyFromURL(sourceBlob.url);
    }

    // ✅ FIXED
    async createReadStream(path: string): Promise<Readable> {

        const blob =
            this.container.getBlockBlobClient(path);

        const res = await blob.download();

        return res.readableStreamBody as Readable;
    }

    readPartial(): Promise<Readable> {
        throw new Error('Not implemented yet');
    }

    async getInfo(path: string): Promise<AttachmentFileInfo> {

        const blob =
            this.container.getBlockBlobClient(path);

        const props = await blob.getProperties();

        return {
            path,
            filename: path.split('/').pop() || '',
            extension: '',
            exists: true,
            size: props.contentLength || 0,
            metadata: {

                etag: props.etag,

                contentType: props.contentType,

                lastModified: props.lastModified,

                cacheControl: props.cacheControl,

                contentDisposition: props.contentDisposition,

                contentEncoding: props.contentEncoding,

                contentLanguage: props.contentLanguage,

            },
        };
    }

    private async streamToBuffer(stream: any): Promise<Buffer> {

        return new Promise((resolve, reject) => {

            const chunks: Buffer[] = [];

            stream.on('data', (d: Buffer) => chunks.push(d));

            stream.on('end', () => resolve(Buffer.concat(chunks)));

            stream.on('error', reject);
        });
    }
}