import { Injectable } from '@nestjs/common';

import {
    join,
    extname,
} from 'path';

import { randomUUID } from 'crypto';

import { STORAGE_CONSTANTS } from '../constants/storage.constants';

import { AttachmentStoragePath } from '../interfaces/attachment-storage-path.interface';

@Injectable()
export class AttachmentPathService {

    //--------------------------------------------------
    // Build Attachment Path
    //--------------------------------------------------

    build(

        organizationId: string,

        originalFilename: string,

    ): AttachmentStoragePath {

        const now =
            new Date();

        const year =
            now
                .getFullYear()
                .toString();

        const month =
            String(
                now.getMonth() + 1,
            ).padStart(
                2,
                '0',
            );

        const extension =
            extname(
                originalFilename,
            ).toLowerCase();

        const filename =
            `${randomUUID()}${extension}`;

        const relativePath =
            join(

                STORAGE_CONSTANTS.ATTACHMENTS_DIRECTORY,

                organizationId,

                year,

                month,

                filename,

            );

        const fullPath =
            join(

                STORAGE_CONSTANTS.ROOT_DIRECTORY,

                STORAGE_CONSTANTS.STORAGE_DIRECTORY,

                relativePath,

            );

        return {

            filename,

            relativePath,

            fullPath,

            directory:
                join(

                    STORAGE_CONSTANTS.ROOT_DIRECTORY,

                    STORAGE_CONSTANTS.STORAGE_DIRECTORY,

                    STORAGE_CONSTANTS.ATTACHMENTS_DIRECTORY,

                    organizationId,

                    year,

                    month,

                ),

        };

    }

    //--------------------------------------------------
    // Temp Path
    //--------------------------------------------------

    buildTempFile(

        extension: string,

    ): string {

        return join(

            STORAGE_CONSTANTS.ROOT_DIRECTORY,

            STORAGE_CONSTANTS.STORAGE_DIRECTORY,

            STORAGE_CONSTANTS.TEMP_DIRECTORY,

            `${randomUUID()}${extension}`,

        );

    }

    //--------------------------------------------------
    // Public Url
    //--------------------------------------------------

    buildPublicUrl(

        relativePath: string,

    ): string {

        return `/storage/${relativePath}`;

    }

    //--------------------------------------------------
    // Physical Path
    //--------------------------------------------------

    buildPhysicalPath(

        relativePath: string,

    ): string {

        return join(

            STORAGE_CONSTANTS.ROOT_DIRECTORY,

            STORAGE_CONSTANTS.STORAGE_DIRECTORY,

            relativePath,

        );

    }

}