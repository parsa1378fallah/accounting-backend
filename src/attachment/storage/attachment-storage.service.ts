import {
    Inject,
    Injectable,
} from '@nestjs/common';

import { dirname, join } from 'path';
import { Readable } from 'stream';

import { IAttachmentStorage } from '../interfaces/attachment-storage.interface';
import * as attachmentStorageProviderInterface from '../interfaces/attachment-storage.provider.interface';
import { AttachmentFileInfo } from '../interfaces/attachment-file-info.interface';
import { STORAGE_PROVIDER } from './attachment-storage.tokens';

@Injectable()
export class AttachmentStorageService
    implements IAttachmentStorage {

    constructor(
        @Inject(STORAGE_PROVIDER)
        private readonly provider: attachmentStorageProviderInterface.IAttachmentStorageProvider,
    ) { }

    //--------------------------------------------------
    // Save
    //--------------------------------------------------

    async save(
        path: string,
        buffer: Buffer,
    ): Promise<void> {

        await this.provider.save(
            path,
            buffer,
        );

    }

    //--------------------------------------------------
    // Read
    //--------------------------------------------------

    async read(
        path: string,
    ): Promise<Buffer> {

        return this.provider.read(path);

    }

    //--------------------------------------------------
    // Stream
    //--------------------------------------------------

    async readStream(
        path: string,
    ): Promise<Readable> {

        return this.provider.createReadStream(
            path,
        );

    }

    //--------------------------------------------------
    // Partial Stream
    //--------------------------------------------------

    async readPartial(
        path: string,
        start: number,
        end: number,
    ): Promise<Readable> {

        return this.provider.readPartial(
            path,
            start,
            end,
        );

    }

    //--------------------------------------------------
    // Delete
    //--------------------------------------------------

    async delete(
        path: string,
    ): Promise<void> {

        await this.provider.delete(path);

    }

    //--------------------------------------------------
    // Exists
    //--------------------------------------------------

    async exists(
        path: string,
    ): Promise<boolean> {

        return this.provider.exists(path);

    }

    //--------------------------------------------------
    // Move
    //--------------------------------------------------

    async move(
        source: string,
        destination: string,
    ): Promise<void> {

        await this.provider.move(
            source,
            destination,
        );

    }

    //--------------------------------------------------
    // Copy
    //--------------------------------------------------

    async copy(
        source: string,
        destination: string,
    ): Promise<void> {

        await this.provider.copy(
            source,
            destination,
        );

    }

    //--------------------------------------------------
    // Rename
    //--------------------------------------------------

    async rename(
        source: string,
        filename: string,
    ): Promise<string> {

        const destination = join(
            dirname(source),
            filename,
        );

        await this.move(
            source,
            destination,
        );

        return destination;

    }

    //--------------------------------------------------
    // Information
    //--------------------------------------------------

    async getInfo(
        path: string,
    ): Promise<AttachmentFileInfo> {

        return this.provider.getInfo(path);

    }

    //--------------------------------------------------
    // Ensure Directory
    //--------------------------------------------------

    async ensureDirectory(
        path: string,
    ): Promise<void> {

        if (
            this.provider.ensureDirectory
        ) {

            await this.provider.ensureDirectory(
                path,
            );

        }

    }

    //--------------------------------------------------
    // Create Directory
    //--------------------------------------------------

    async createDirectory(
        path: string,
    ): Promise<void> {

        if (
            this.provider.createDirectory
        ) {

            await this.provider.createDirectory(
                path,
            );

        }

    }

    //--------------------------------------------------
    // Delete Directory
    //--------------------------------------------------

    async deleteDirectory(
        path: string,
    ): Promise<void> {

        if (
            this.provider.deleteDirectory
        ) {

            await this.provider.deleteDirectory(
                path,
            );

        }

    }

    //--------------------------------------------------
    // List Files
    //--------------------------------------------------

    async listFiles(
        path: string,
    ): Promise<string[]> {

        if (
            this.provider.listFiles
        ) {

            return this.provider.listFiles(
                path,
            );

        }

        return [];

    }

    //--------------------------------------------------
    // Health Check
    //--------------------------------------------------

    async healthCheck(): Promise<boolean> {

        if (
            this.provider.healthCheck
        ) {

            return this.provider.healthCheck();

        }

        return true;

    }

    //--------------------------------------------------
    // Temporary URL
    //--------------------------------------------------

    async generateTemporaryUrl(
        path: string,
        expiresIn = 300,
    ): Promise<string | null> {

        if (
            this.provider.generateTemporaryUrl
        ) {

            return this.provider.generateTemporaryUrl(
                path,
                expiresIn,
            );

        }

        return null;

    }

    //--------------------------------------------------
    // Storage Usage
    //--------------------------------------------------

    async getStorageUsage() {

        if (
            this.provider.getStorageUsage
        ) {

            return this.provider.getStorageUsage();

        }

        return null;

    }

    //--------------------------------------------------
    // Cleanup
    //--------------------------------------------------

    async cleanup(): Promise<void> {

        if (
            this.provider.cleanup
        ) {

            await this.provider.cleanup();

        }

    }

    //--------------------------------------------------
    // Validate Storage
    //--------------------------------------------------

    async validateStorage(): Promise<boolean> {

        if (
            this.provider.validateStorage
        ) {

            return this.provider.validateStorage();

        }

        return true;

    }

}