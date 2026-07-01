import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class SignedUrlService {

    private readonly secret =
        process.env.ATTACHMENT_SECRET || 'secret-key';

    //--------------------------------------------------
    // CREATE SIGNED URL
    //--------------------------------------------------

    sign(
        attachmentId: string,
        expiresInSeconds = 300,
    ) {
        const expires =
            Math.floor(Date.now() / 1000) + expiresInSeconds;

        const payload =
            `${attachmentId}.${expires}`;

        const signature =
            crypto
                .createHmac('sha256', this.secret)
                .update(payload)
                .digest('hex');

        return {
            url: `/attachments/${attachmentId}/download?expires=${expires}&signature=${signature}`,
            expires,
        };
    }

    //--------------------------------------------------
    // VERIFY SIGNATURE
    //--------------------------------------------------

    verify(
        attachmentId: string,
        expires: number,
        signature: string,
    ) {
        const now =
            Math.floor(Date.now() / 1000);

        if (now > expires) {
            return false;
        }

        const payload =
            `${attachmentId}.${expires}`;

        const expected =
            crypto
                .createHmac('sha256', this.secret)
                .update(payload)
                .digest('hex');

        return expected === signature;
    }
}