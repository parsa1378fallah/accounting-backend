import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { StorageDriver } from './enums/storage-driver.enum';

import { LocalStorageProvider } from './providers/local-storage.provider';
import { S3StorageProvider } from './providers/s3-storage.provider';
import { MinioStorageProvider } from './providers/minio-storage.provider';
import { AzureStorageProvider } from './providers/azure-storage.provider';

import { IAttachmentStorageProvider } from '../interfaces/attachment-storage.provider.interface';

@Injectable()
export class AttachmentStorageFactory {

    constructor(

        private readonly configService: ConfigService,

        private readonly localProvider: LocalStorageProvider,

        private readonly s3Provider: S3StorageProvider,

        private readonly minioProvider: MinioStorageProvider,

        private readonly azureProvider: AzureStorageProvider,

    ) { }

    //--------------------------------------------------
    // Create Provider
    //--------------------------------------------------

    create(): IAttachmentStorageProvider {

        const driver =
            this.configService.get<StorageDriver>(
                'STORAGE_DRIVER',
                StorageDriver.LOCAL,
            );

        switch (driver) {

            case StorageDriver.LOCAL:
                return this.localProvider;

            case StorageDriver.S3:
                return this.s3Provider;

            case StorageDriver.MINIO:
                return this.minioProvider;

            case StorageDriver.AZURE:
                return this.azureProvider;

            default:

                throw new Error(
                    `Unsupported storage driver: ${driver}`,
                );

        }

    }

}