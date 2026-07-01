import {
    Injectable,
    ForbiddenException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AttachmentAccessService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    //--------------------------------------------------
    // CHECK ACCESS
    //--------------------------------------------------

    async canAccess(
        attachmentId: string,
        userId: string,
        organizationId: string,
    ) {

        const file =
            await this.prisma.attachment.findUnique({
                where: { id: attachmentId },
            });

        if (!file) {
            return false;
        }

        //--------------------------------------------------
        // Organization Isolation
        //--------------------------------------------------

        if (file.organizationId !== organizationId) {
            throw new ForbiddenException(
                'Cross organization access denied.',
            );
        }

        //--------------------------------------------------
        // Public File
        //--------------------------------------------------

        if (file.isPublic) {
            return true;
        }

        //--------------------------------------------------
        // Ownership Check (future expansion)
        //--------------------------------------------------

        if (file.uploadedById === userId) {
            return true;
        }

        throw new ForbiddenException(
            'You do not have access to this file.',
        );
    }
}