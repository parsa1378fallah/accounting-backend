import { Injectable } from '@nestjs/common';

import { AttachmentRepository } from '../repositories/attachment.repository';

@Injectable()
export class AttachmentSummaryService {
    constructor(
        private readonly repository: AttachmentRepository,
    ) { }

    //--------------------------------------------------
    // Summary
    //--------------------------------------------------

    async getSummary(
        organizationId: string,
    ) {

        const attachments =
            await this.repository.findMany({
                organizationId,
            });

        //--------------------------------------------------
        // Active
        //--------------------------------------------------

        const active =
            attachments.filter(
                x => !x.deletedAt,
            );

        //--------------------------------------------------
        // Total Files
        //--------------------------------------------------

        const totalFiles =
            active.length;

        //--------------------------------------------------
        // Deleted Files
        //--------------------------------------------------

        const deletedFiles =
            attachments.filter(
                x => x.deletedAt,
            ).length;

        //--------------------------------------------------
        // Public Files
        //--------------------------------------------------

        const publicFiles =
            active.filter(
                x => x.isPublic,
            ).length;

        //--------------------------------------------------
        // Private Files
        //--------------------------------------------------

        const privateFiles =
            active.filter(
                x => !x.isPublic,
            ).length;

        //--------------------------------------------------
        // Total Size
        //--------------------------------------------------

        const totalSize =
            active.reduce(
                (sum, file) => sum + file.size,
                0,
            );

        //--------------------------------------------------
        // Average Size
        //--------------------------------------------------

        const averageSize =
            totalFiles === 0
                ? 0
                : totalSize / totalFiles;

        //--------------------------------------------------
        // By Mime Type
        //--------------------------------------------------

        const mimeTypes =
            active.reduce(
                (acc, file) => {

                    acc[file.mimeType] =
                        (acc[file.mimeType] ?? 0) + 1;

                    return acc;

                },
                {} as Record<string, number>,
            );

        //--------------------------------------------------
        // By Extension
        //--------------------------------------------------

        const extensions =
            active.reduce(
                (acc, file) => {

                    acc[file.extension] =
                        (acc[file.extension] ?? 0) + 1;

                    return acc;

                },
                {} as Record<string, number>,
            );

        return {

            totalFiles,

            deletedFiles,

            publicFiles,

            privateFiles,

            totalSize,

            averageSize,

            mimeTypes,

            extensions,
        };
    }
}