import { Injectable } from '@nestjs/common';

import {
    randomUUID,
    randomBytes,
    createHash,
} from 'crypto';

import {
    basename,
    extname,
} from 'path';

import { ulid } from 'ulid';

import slugify from 'slugify';

import { AttachmentFilenameOptions } from '../interfaces/attachment-filename-options.interface';
import { AttachmentFilenameStrategy } from '../enums/attachment-filename-strategy.enum.';


@Injectable()
export class AttachmentFilenameService {

    private static readonly DEFAULT_MAX_LENGTH = 255;

    private static readonly RESERVED_NAMES = new Set([

        'CON',
        'PRN',
        'AUX',
        'NUL',

        'COM1',
        'COM2',
        'COM3',
        'COM4',
        'COM5',
        'COM6',
        'COM7',
        'COM8',
        'COM9',

        'LPT1',
        'LPT2',
        'LPT3',
        'LPT4',
        'LPT5',
        'LPT6',
        'LPT7',
        'LPT8',
        'LPT9',

    ]);

    //--------------------------------------------------
    // Generate
    //--------------------------------------------------

    generate(
        options: AttachmentFilenameOptions,
    ): string {

        const {

            strategy = AttachmentFilenameStrategy.UUID,

            originalName,

            preserveExtension = true,

        } = options;

        let filename: string;

        switch (strategy) {

            case AttachmentFilenameStrategy.UUID:

                filename =
                    this.generateUuid();

                break;


            case AttachmentFilenameStrategy.TIMESTAMP:

                filename =
                    this.generateTimestamp();

                break;

            case AttachmentFilenameStrategy.RANDOM:

                filename =
                    this.generateRandom();

                break;

            case AttachmentFilenameStrategy.HASH:

                filename =
                    this.generateHash(
                        options.hashBuffer ??
                        Buffer.from(originalName),
                    );

                break;

            default:

                filename =
                    this.generateUuid();

        }

        return this.buildFilename(

            filename,

            originalName,

            {

                ...options,

                preserveExtension,

            },

        );

    }

    //--------------------------------------------------
    // UUID
    //--------------------------------------------------

    generateUuid(): string {

        return randomUUID();

    }

    //--------------------------------------------------
    // ULID
    //--------------------------------------------------

    generateUlid(): string {

        return ulid();

    }

    //--------------------------------------------------
    // Timestamp
    //--------------------------------------------------

    generateTimestamp(): string {

        return `${this.createTimestamp()}_${this.createRandomString(8)}`;

    }

    //--------------------------------------------------
    // Random
    //--------------------------------------------------

    generateRandom(
        length = 32,
    ): string {

        return this.createRandomString(length);

    }

    //--------------------------------------------------
    // Hash
    //--------------------------------------------------

    generateHash(
        buffer: Buffer,
    ): string {

        return this.createHash(buffer);

    }

    //--------------------------------------------------
    // Build Filename
    //--------------------------------------------------

    buildFilename(

        filename: string,

        originalName: string,

        options: AttachmentFilenameOptions,

    ): string {

        let result = filename;

        result =
            this.appendPrefix(
                result,
                options.prefix,
            );

        result =
            this.appendSuffix(
                result,
                options.suffix,
            );

        result =
            this.truncate(

                result,

                options.maxLength ??
                AttachmentFilenameService.DEFAULT_MAX_LENGTH,

            );

        if (

            options.preserveExtension !== false

        ) {

            result =
                this.ensureExtension(

                    result,

                    this.getExtension(originalName),

                );

        }

        return result;

    }

    //--------------------------------------------------
    // Sanitize
    //--------------------------------------------------

    sanitize(
        filename: string,
    ): string {

        filename =
            this.normalize(filename);

        filename =
            filename.trim();

        filename =
            filename.replace(/\s+/g, ' ');

        filename =
            filename.replace(

                /[<>:"/\\|?*\x00-\x1F]/g,

                '_',

            );

        filename =
            filename.replace(
                /^\.+/,
                '',
            );

        const basename =
            this.removeExtension(filename);

        if (

            AttachmentFilenameService.RESERVED_NAMES.has(
                basename.toUpperCase(),
            )

        ) {

            filename =
                `file_${filename}`;

        }

        return filename;

    }

    //--------------------------------------------------
    // Normalize Unicode
    //--------------------------------------------------

    normalize(
        filename: string,
    ): string {

        return filename.normalize('NFC');

    }

    //--------------------------------------------------
    // Slugify
    //--------------------------------------------------

    slugify(
        filename: string,
    ): string {

        return slugify(

            this.removeExtension(filename),

            {

                lower: true,

                strict: true,

                trim: true,

            },

        );

    }

    //--------------------------------------------------
    // Truncate
    //--------------------------------------------------

    truncate(

        value: string,

        maxLength: number,

    ): string {

        if (

            value.length <= maxLength

        ) {

            return value;

        }

        return value.substring(
            0,
            maxLength,
        );

    }

    //--------------------------------------------------
    // Prefix
    //--------------------------------------------------

    appendPrefix(

        filename: string,

        prefix?: string,

    ): string {

        if (!prefix) {

            return filename;

        }

        return `${prefix}_${filename}`;

    }

    //--------------------------------------------------
    // Suffix
    //--------------------------------------------------

    appendSuffix(

        filename: string,

        suffix?: string,

    ): string {

        if (!suffix) {

            return filename;

        }

        return `${filename}_${suffix}`;

    }

    //--------------------------------------------------
    // Ensure Extension
    //--------------------------------------------------

    ensureExtension(

        filename: string,

        extension: string,

    ): string {

        if (!extension) {

            return filename;

        }

        if (

            filename.endsWith(extension)

        ) {

            return filename;

        }

        return `${filename}${extension}`;

    }

    //--------------------------------------------------
    // Extension
    //--------------------------------------------------

    getExtension(
        filename: string,
    ): string {

        return extname(filename).toLowerCase();

    }

    //--------------------------------------------------
    // Basename
    //--------------------------------------------------

    getBasename(
        filename: string,
    ): string {

        return basename(
            filename,
            extname(filename),
        );

    }

    //--------------------------------------------------
    // Remove Extension
    //--------------------------------------------------

    removeExtension(
        filename: string,
    ): string {

        return basename(
            filename,
            extname(filename),
        );

    }

    //--------------------------------------------------
    // Random String
    //--------------------------------------------------

    createRandomString(
        length = 32,
    ): string {

        return randomBytes(length)

            .toString('hex')

            .substring(0, length);

    }

    //--------------------------------------------------
    // Timestamp
    //--------------------------------------------------

    createTimestamp(): string {

        const now =
            new Date();

        return now

            .toISOString()

            .replace(/[-:]/g, '')

            .replace(/\..+/, '')

            .replace('T', '_');

    }

    //--------------------------------------------------
    // SHA256
    //--------------------------------------------------

    createHash(
        buffer: Buffer,
    ): string {

        return createHash('sha256')

            .update(buffer)

            .digest('hex');

    }

}