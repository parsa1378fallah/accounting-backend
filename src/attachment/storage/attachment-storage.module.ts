import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { STORAGE_PROVIDER } from './attachment-storage.tokens';

import { AttachmentStorageFactory } from './attachment-storage.factory';
import { AttachmentStorageService } from './attachment-storage.service';

import { LocalStorageProvider } from './providers/local-storage.provider';
import { S3StorageProvider } from './providers/s3-storage.provider';
import { MinioStorageProvider } from './providers/minio-storage.provider';
import { AzureStorageProvider } from './providers/azure-storage.provider';

@Module({

    imports: [

        ConfigModule,

    ],

    providers: [

        //--------------------------------------------------
        // Providers
        //--------------------------------------------------

        LocalStorageProvider,

        S3StorageProvider,

        MinioStorageProvider,

        AzureStorageProvider,

        //--------------------------------------------------
        // Factory
        //--------------------------------------------------

        AttachmentStorageFactory,

        //--------------------------------------------------
        // Selected Provider
        //--------------------------------------------------

        {

            provide: STORAGE_PROVIDER,

            useFactory: (

                factory: AttachmentStorageFactory,

            ) => factory.create(),

            inject: [

                AttachmentStorageFactory,

            ],

        },

        //--------------------------------------------------
        // Facade
        //--------------------------------------------------

        AttachmentStorageService,

    ],

    exports: [

        AttachmentStorageService,

        STORAGE_PROVIDER,

    ],

})
export class AttachmentStorageModule { }