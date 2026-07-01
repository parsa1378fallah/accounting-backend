import { StorageDriver } from './enums/storage-driver.enum';

export interface LocalStorageConfig {

    root: string;

}

export interface S3StorageConfig {

    region: string;

    bucket: string;

    accessKeyId: string;

    secretAccessKey: string;

}

export interface MinioStorageConfig {

    endpoint: string;

    port: number;

    useSSL: boolean;

    accessKey: string;

    secretKey: string;

    bucket: string;

}

export interface AzureStorageConfig {

    connectionString: string;

    container: string;

}

export interface AttachmentStorageConfig {

    driver: StorageDriver;

    local?: LocalStorageConfig;

    s3?: S3StorageConfig;

    minio?: MinioStorageConfig;

    azure?: AzureStorageConfig;

}