import {
    Injectable,
} from '@nestjs/common';

import {
    createHash,
    Hash,
} from 'crypto';
import { AttachmentChecksums } from '../interfaces/attachment-checksum.interface';

@Injectable()
export class AttachmentChecksumService {

    //--------------------------------------------------
    // SHA256
    //--------------------------------------------------

    calculateSha256(
        buffer: Buffer,
    ): string {

        return this.hash(
            'sha256',
            buffer,
        );

    }

    //--------------------------------------------------
    // SHA1
    //--------------------------------------------------

    calculateSha1(
        buffer: Buffer,
    ): string {

        return this.hash(
            'sha1',
            buffer,
        );

    }

    //--------------------------------------------------
    // MD5
    //--------------------------------------------------

    calculateMd5(
        buffer: Buffer,
    ): string {

        return this.hash(
            'md5',
            buffer,
        );

    }

    //--------------------------------------------------
    // Generic Hash
    //--------------------------------------------------

    private hash(
        algorithm:
            | 'sha256'
            | 'sha1'
            | 'md5',
        buffer: Buffer,
    ): string {

        const hash: Hash =
            createHash(
                algorithm,
            );

        hash.update(buffer);

        return hash.digest(
            'hex',
        );

    }

    //--------------------------------------------------
    // Verify SHA256
    //--------------------------------------------------

    verifySha256(
        buffer: Buffer,
        checksum: string,
    ): boolean {

        return (
            this.calculateSha256(
                buffer,
            ) === checksum
        );

    }

    //--------------------------------------------------
    // Verify SHA1
    //--------------------------------------------------

    verifySha1(
        buffer: Buffer,
        checksum: string,
    ): boolean {

        return (
            this.calculateSha1(
                buffer,
            ) === checksum
        );

    }

    //--------------------------------------------------
    // Verify MD5
    //--------------------------------------------------

    verifyMd5(
        buffer: Buffer,
        checksum: string,
    ): boolean {

        return (
            this.calculateMd5(
                buffer,
            ) === checksum
        );

    }

    //--------------------------------------------------
    // Compare Buffers
    //--------------------------------------------------

    compareBuffers(
        first: Buffer,
        second: Buffer,
    ): boolean {

        return (
            this.calculateSha256(first) ===
            this.calculateSha256(second)
        );

    }

    //--------------------------------------------------
    // Multi Checksum
    //--------------------------------------------------

    calculateAll(
        buffer: Buffer,
    ): AttachmentChecksums {

        return {

            sha256:
                this.calculateSha256(
                    buffer,
                ),

            sha1:
                this.calculateSha1(
                    buffer,
                ),

            md5:
                this.calculateMd5(
                    buffer,
                ),

        };

    }

}