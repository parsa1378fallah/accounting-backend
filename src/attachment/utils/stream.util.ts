import { Readable } from 'stream';
export function setDownloadHeaders(
    res: any,
    filename: string,
) {
    res.setHeader(
        'Content-Disposition',
        `attachment; filename="${filename}"`,
    );

    res.setHeader(
        'Cache-Control',
        'private, max-age=86400',
    );
}

export async function streamToBuffer(
    stream: Readable,
): Promise<Buffer> {

    const chunks: Buffer[] = [];

    return new Promise((resolve, reject) => {

        stream.on(
            'data',
            chunk => chunks.push(Buffer.from(chunk)),
        );

        stream.on(
            'end',
            () => resolve(Buffer.concat(chunks)),
        );

        stream.on(
            'error',
            reject,
        );

    });

}