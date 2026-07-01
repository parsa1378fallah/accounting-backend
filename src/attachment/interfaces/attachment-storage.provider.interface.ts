import { Readable } from 'stream';

import { AttachmentFileInfo } from './attachment-file-info.interface';

export interface IAttachmentStorageProvider {

    //--------------------------------------------------
    // File Operations
    //--------------------------------------------------

    save(
        path: string,
        buffer: Buffer,
    ): Promise<void>;

    read(
        path: string,
    ): Promise<Buffer>;

    delete(
        path: string,
    ): Promise<void>;

    exists(
        path: string,
    ): Promise<boolean>;

    move(
        source: string,
        destination: string,
    ): Promise<void>;

    copy(
        source: string,
        destination: string,
    ): Promise<void>;

    //--------------------------------------------------
    // Streams
    //--------------------------------------------------

    createReadStream(
        path: string,
    ): Promise<Readable>;

    readPartial(
        path: string,
        start: number,
        end: number,
    ): Promise<Readable>;

    //--------------------------------------------------
    // Information
    //--------------------------------------------------

    getInfo(
        path: string,
    ): Promise<AttachmentFileInfo>;

    //--------------------------------------------------
    // Directory Operations
    //--------------------------------------------------

    ensureDirectory?(
        path: string,
    ): Promise<void>;

    createDirectory?(
        path: string,
    ): Promise<void>;

    deleteDirectory?(
        path: string,
    ): Promise<void>;

    listFiles?(
        path: string,
    ): Promise<string[]>;

    //--------------------------------------------------
    // Health
    //--------------------------------------------------

    healthCheck?(): Promise<boolean>;

    //--------------------------------------------------
    // Temporary Url
    //--------------------------------------------------

    generateTemporaryUrl?(
        path: string,
        expiresIn?: number,
    ): Promise<string>;

    //--------------------------------------------------
    // Metrics
    //--------------------------------------------------

    getStorageUsage?(): Promise<{

        totalFiles: number;

        totalSize: number;

    }>;

    //--------------------------------------------------
    // Validation
    //--------------------------------------------------

    validateStorage?(): Promise<boolean>;

    //--------------------------------------------------
    // Cleanup
    //--------------------------------------------------

    cleanup?(): Promise<void>;

}