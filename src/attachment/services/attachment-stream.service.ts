import {
    Injectable,
} from '@nestjs/common';

import { Response } from 'express';
import * as fs from 'fs';

import { parseRange } from '../utils/range-parser.util';

@Injectable()
export class AttachmentStreamService {

    //--------------------------------------------------
    // STREAM FILE (FULL or RANGE)
    //--------------------------------------------------

    stream(
        path: string,
        res: Response,
        mimeType: string,
        range?: string,
    ) {

        const fileSize =
            fs.statSync(path).size;

        //--------------------------------------------------
        // RANGE REQUEST (VIDEO / AUDIO)
        //--------------------------------------------------

        if (range) {

            const { start, end, chunkSize } =
                parseRange(range, fileSize);

            const stream =
                fs.createReadStream(path, {
                    start,
                    end,
                });

            res.writeHead(206, {
                'Content-Range':
                    `bytes ${start}-${end}/${fileSize}`,

                'Accept-Ranges': 'bytes',

                'Content-Length': chunkSize,

                'Content-Type': mimeType,
            });

            return stream.pipe(res);
        }

        //--------------------------------------------------
        // FULL STREAM
        //--------------------------------------------------

        const stream =
            fs.createReadStream(path);

        res.setHeader(
            'Content-Type',
            mimeType,
        );

        res.setHeader(
            'Accept-Ranges',
            'bytes',
        );

        res.setHeader(
            'Cache-Control',
            'public, max-age=31536000, immutable',
        );

        return stream.pipe(res);
    }
}