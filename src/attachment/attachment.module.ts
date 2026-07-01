import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { PrismaModule } from 'src/prisma/prisma.module';

import { AttachmentStorageModule } from './storage/attachment-storage.module';

import { AttachmentController } from './controllers/attachment.controller';
import { AttachmentUploadController } from './controllers/attachment-upload.controller';
import { AttachmentDownloadController } from './controllers/attachment-download.controller';

import { AttachmentService } from './services/attachment.service';
import { AttachmentUploadService } from './services/attachment-upload.service';
import { AttachmentDownloadService } from './services/attachment-download.service';
import { AttachmentQueryService } from './services/attachment-query.service';
import { AttachmentSummaryService } from './services/attachment-summary.service';
import { AttachmentStreamService } from './services/attachment-stream.service';
import { AttachmentValidationService } from './services/attachment-validation.service';
import { AttachmentChecksumService } from './services/attachment-checksum.service';
import { AttachmentFilenameService } from './services/attachment-filename.service';

import { AttachmentRepository } from './repositories/attachment.repository';

import { AttachmentMapper } from './mappers/attachment.mapper';
import { AttachmentValidator } from './validators/attachment.validator';
import { AttachmentStorageService } from './storage/attachment-storage.service';
import { AttachmentMetadataService } from './services/attachment-metadata.service';
import { AttachmentPathService } from './services/attachment-path.service';

@Module({

    imports: [

        PrismaModule,

        EventEmitterModule,

        AttachmentStorageModule,

    ],

    controllers: [

        AttachmentController,

        AttachmentUploadController,

        AttachmentDownloadController,

    ],

    providers: [

        //--------------------------------------------------
        // Repository
        //--------------------------------------------------

        AttachmentRepository,

        //--------------------------------------------------
        // Mapper
        //--------------------------------------------------

        AttachmentMapper,

        //--------------------------------------------------
        // Domain Services
        //--------------------------------------------------

        AttachmentValidationService,

        AttachmentChecksumService,

        AttachmentFilenameService,

        //--------------------------------------------------
        // Application Services
        //--------------------------------------------------

        AttachmentService,

        AttachmentUploadService,

        AttachmentDownloadService,

        AttachmentQueryService,

        AttachmentSummaryService,

        AttachmentStreamService,
        AttachmentValidator,


        AttachmentStorageService,
        AttachmentMetadataService,


        AttachmentPathService,

    ],

    exports: [

        //--------------------------------------------------
        // Application Services
        //--------------------------------------------------

        AttachmentService,

        AttachmentUploadService,

        AttachmentDownloadService,

        AttachmentQueryService,

        AttachmentSummaryService,

        AttachmentStreamService,

        //--------------------------------------------------
        // Repository
        //--------------------------------------------------

        AttachmentRepository,

        //--------------------------------------------------
        // Domain Services
        //--------------------------------------------------

        AttachmentValidationService,

        AttachmentChecksumService,

        AttachmentFilenameService,

    ],

})
export class AttachmentModule { }