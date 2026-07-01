import * as crypto from 'crypto';

export function generateETag(
    data: Buffer | string,
) {
    return crypto
        .createHash('md5')
        .update(data)
        .digest('hex');
}