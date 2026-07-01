import { Readable } from 'stream';

import { AttachmentFileInfo } from './attachment-file-info.interface';

export interface IAttachmentStorage {

    save(
        path: string,
        buffer: Buffer,
    ): Promise<void>;

    read(
        path: string,
    ): Promise<Buffer>;

    readStream(
        path: string,
    ): Promise<Readable>;

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

    ensureDirectory(
        path: string,
    ): Promise<void>;

    getInfo(
        path: string,
    ): Promise<AttachmentFileInfo>;

}