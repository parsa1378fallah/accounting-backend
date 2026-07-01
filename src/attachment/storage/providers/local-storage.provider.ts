import {
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';

import {
    promises as fs,
    createReadStream,
} from 'fs';

import { dirname, basename } from 'path';

import { Readable } from 'stream';

import { AttachmentFileInfo } from 'src/attachment/interfaces/attachment-file-info.interface';
import { IAttachmentStorageProvider } from 'src/attachment/interfaces/attachment-storage.provider.interface';

@Injectable()
export class LocalStorageProvider
    implements IAttachmentStorageProvider {

    async save(path: string, buffer: Buffer) {

        try {

            const dir = dirname(path);

            await fs.mkdir(dir, { recursive: true });

            const tempPath = `${path}.tmp`;

            await fs.writeFile(tempPath, buffer);

            await fs.rename(tempPath, path);

        } catch {

            throw new InternalServerErrorException(
                'Failed to save file locally',
            );

        }
    }

    async read(path: string) {

        return fs.readFile(path);
    }

    async delete(path: string) {

        try {
            await fs.unlink(path);
        } catch { }
    }

    async exists(path: string) {

        try {
            await fs.access(path);
            return true;
        } catch {
            return false;
        }
    }

    async move(source: string, destination: string) {

        await fs.mkdir(dirname(destination), { recursive: true });

        await fs.rename(source, destination);
    }

    async copy(source: string, destination: string) {

        await fs.mkdir(dirname(destination), { recursive: true });

        await fs.copyFile(source, destination);
    }

    // ✅ FIXED
    async createReadStream(path: string): Promise<Readable> {

        return createReadStream(path);
    }

    // ✅ FIXED
    async readPartial(
        path: string,
        start: number,
        end: number,
    ): Promise<Readable> {

        return createReadStream(path, {
            start,
            end,
        });
    }

    async getInfo(
        path: string,
    ): Promise<AttachmentFileInfo> {

        const stats =
            await fs.stat(path);

        return {

            path,

            filename:
                basename(path),

            extension:
                path.split('.').pop() ?? '',

            exists: true,

            size:
                stats.size,

            metadata: {

                lastModified:
                    stats.mtime,

            },

        };

    }
}