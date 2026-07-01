export interface AttachmentFilenameOptions {
    hashBuffer: Buffer;
    maxLength: number;

    originalName: string;

    prefix?: string;

    suffix?: string;

    preserveExtension?: boolean;

    strategy?:
    | 'uuid'
    | 'timestamp'
    | 'random'
    | 'hash';

}