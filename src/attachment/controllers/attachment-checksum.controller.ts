import {
    Body,
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { IsString } from 'class-validator';

import { AttachmentChecksumService } from '../services/attachment-checksum.service';

class VerifyChecksumDto {
    @IsString()
    checksum: string;

    @IsString()
    algorithm: 'sha256' | 'sha1' | 'md5';
}

// این کنترلر ابزار کمکی است (مثلاً برای تست یکپارچگی فایل قبل از آپلود
// رسمی)؛ خود AttachmentUploadService در مسیر آپلود اصلی از سرویس چک‌سام
// به‌صورت داخلی استفاده می‌کند.
@Controller('attachments/checksum')
export class AttachmentChecksumController {
    constructor(
        private readonly checksumService: AttachmentChecksumService,
    ) {}

    //--------------------------------------------------
    // Calculate all checksums (sha256, sha1, md5) for a file
    //--------------------------------------------------

    @Post('calculate')
    @UseInterceptors(FileInterceptor('file'))
    calculate(@UploadedFile() file: Express.Multer.File) {
        return this.checksumService.calculateAll(file.buffer);
    }

    //--------------------------------------------------
    // Verify a file matches an expected checksum
    //--------------------------------------------------

    @Post('verify')
    @UseInterceptors(FileInterceptor('file'))
    verify(
        @UploadedFile() file: Express.Multer.File,
        @Body() dto: VerifyChecksumDto,
    ) {
        const verifiers = {
            sha256: () => this.checksumService.verifySha256(file.buffer, dto.checksum),
            sha1:   () => this.checksumService.verifySha1(file.buffer, dto.checksum),
            md5:    () => this.checksumService.verifyMd5(file.buffer, dto.checksum),
        };

        return { matches: verifiers[dto.algorithm]() };
    }
}
