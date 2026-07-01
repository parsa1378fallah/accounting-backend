import {
    BadRequestException,
    Injectable,
    Logger,
} from '@nestjs/common';

import { extname } from 'path';

import { ALLOWED_MIME_TYPES } from '../constants/mime-types.constants';
import { FORBIDDEN_EXTENSIONS } from '../constants/forbidden-extensions.constants';
import { ATTACHMENT_LIMITS } from '../constants/attachment.constants';
import { PATH_TRAVERSAL_PATTERNS } from '../constants/path-traversal.constant';
import { RESERVED_WINDOWS_NAMES } from '../constants/reserved-file-names.constant';
import { SUSPICIOUS_INNER_EXTENSIONS } from '../constants/suspicious-extensions.constant';
import { FILE_SIGNATURES } from '../constants/file-signatures.constant';
import { MIME_EXTENSION_MAP } from '../constants/mime-extension-map.constant';
import { AttachmentValidationErrorCode } from '../enums/attachment-validation-error-code.enum';
import { ALLOWED_FILENAME_REGEX } from '../constants/filename-regex.constant';

export class AttachmentValidationException extends BadRequestException {

    constructor(
        public readonly code: AttachmentValidationErrorCode,
        message: string,
    ) {

        super({
            statusCode: 400,
            error: 'Bad Request',
            code,
            message,
        });

    }

}


//--------------------------------------------------
// Service
//--------------------------------------------------

@Injectable()
export class AttachmentValidationService {

    private readonly logger = new Logger(
        AttachmentValidationService.name,
    );

    //--------------------------------------------------
    // Validate Upload (entry point)
    //--------------------------------------------------
    // Runs every check and throws on the first failure.
    // Order matters: cheap/structural checks run before
    // content-based checks (file signature reading).
    //--------------------------------------------------

    validate(
        file: Express.Multer.File,
    ): void {

        this.validateFileExists(file);
        this.validateNotEmpty(file);
        this.validateFileSize(file);

        this.validateFilename(file.originalname);
        this.validateAllowedCharacters(file.originalname);
        this.validatePathTraversal(file.originalname);
        this.validateReservedNames(file.originalname);

        this.validateExtension(file.originalname);
        this.validateDoubleExtension(file.originalname);

        this.validateMimeType(file.mimetype);
        this.validateMimeMatchesExtension(file.originalname, file.mimetype);
        this.validateFileSignature(file);

        this.logger.debug(
            `Attachment passed validation: "${file.originalname}" (${file.mimetype}, ${file.size} bytes)`,
        );

    }

    //--------------------------------------------------
    // File Exists
    //--------------------------------------------------

    private validateFileExists(
        file?: Express.Multer.File,
    ): void {

        if (!file) {

            throw new AttachmentValidationException(
                AttachmentValidationErrorCode.FILE_MISSING,
                'No file uploaded.',
            );

        }

    }

    //--------------------------------------------------
    // Empty File
    //--------------------------------------------------

    private validateNotEmpty(
        file: Express.Multer.File,
    ): void {

        if (file.size === 0) {

            throw new AttachmentValidationException(
                AttachmentValidationErrorCode.FILE_EMPTY,
                'Uploaded file is empty.',
            );

        }

    }

    //--------------------------------------------------
    // Size
    //--------------------------------------------------

    private validateFileSize(
        file: Express.Multer.File,
    ): void {

        if (file.size > ATTACHMENT_LIMITS.MAX_FILE_SIZE) {

            throw new AttachmentValidationException(
                AttachmentValidationErrorCode.FILE_TOO_LARGE,
                `Maximum allowed file size is ${ATTACHMENT_LIMITS.MAX_FILE_SIZE} bytes.`,
            );

        }

    }

    //--------------------------------------------------
    // Filename (basic shape)
    //--------------------------------------------------

    private validateFilename(
        filename: string,
    ): void {

        if (!filename?.trim()) {

            throw new AttachmentValidationException(
                AttachmentValidationErrorCode.FILENAME_REQUIRED,
                'Filename is required.',
            );

        }

        if (filename.length > ATTACHMENT_LIMITS.MAX_FILENAME_LENGTH) {

            throw new AttachmentValidationException(
                AttachmentValidationErrorCode.FILENAME_TOO_LONG,
                `Filename cannot exceed ${ATTACHMENT_LIMITS.MAX_FILENAME_LENGTH} characters.`,
            );

        }

        if (filename.startsWith('.')) {

            throw new AttachmentValidationException(
                AttachmentValidationErrorCode.FILENAME_HIDDEN,
                'Hidden files are not allowed.',
            );

        }

        if (filename !== filename.trim()) {

            throw new AttachmentValidationException(
                AttachmentValidationErrorCode.FILENAME_INVALID_SPACING,
                'Filename contains invalid spaces.',
            );

        }

    }

    //--------------------------------------------------
    // Allowed Characters
    //--------------------------------------------------

    private validateAllowedCharacters(
        filename: string,
    ): void {

        if (!ALLOWED_FILENAME_REGEX.test(filename)) {

            throw new AttachmentValidationException(
                AttachmentValidationErrorCode.FILENAME_INVALID_CHARACTERS,
                'Filename contains invalid characters.',
            );

        }

    }

    //--------------------------------------------------
    // Path Traversal
    //--------------------------------------------------

    private validatePathTraversal(
        filename: string,
    ): void {

        const lower = filename.toLowerCase();

        const hasTraversal = PATH_TRAVERSAL_PATTERNS.some(
            pattern => lower.includes(pattern),
        );

        if (hasTraversal) {

            throw new AttachmentValidationException(
                AttachmentValidationErrorCode.PATH_TRAVERSAL,
                'Invalid filename.',
            );

        }

    }

    //--------------------------------------------------
    // Reserved Names (Windows device names)
    //--------------------------------------------------

    private validateReservedNames(
        filename: string,
    ): void {

        const name = filename.split('.')[0].toUpperCase();

        if (RESERVED_WINDOWS_NAMES.has(name)) {

            throw new AttachmentValidationException(
                AttachmentValidationErrorCode.RESERVED_FILENAME,
                'Reserved filename is not allowed.',
            );

        }

    }

    //--------------------------------------------------
    // Extension
    //--------------------------------------------------

    private validateExtension(
        filename: string,
    ): void {

        const extension = extname(filename).toLowerCase();

        if (!extension) {

            throw new AttachmentValidationException(
                AttachmentValidationErrorCode.EXTENSION_MISSING,
                'File extension is required.',
            );

        }

        if (FORBIDDEN_EXTENSIONS.includes(extension)) {

            throw new AttachmentValidationException(
                AttachmentValidationErrorCode.EXTENSION_FORBIDDEN,
                'This file extension is forbidden.',
            );

        }

    }

    //--------------------------------------------------
    // Double Extension (e.g. invoice.pdf.exe)
    //--------------------------------------------------

    private validateDoubleExtension(
        filename: string,
    ): void {

        const parts = filename.split('.').filter(Boolean);

        if (parts.length <= 2) {
            return;
        }

        const innerExtensions = parts
            .slice(1, -1)
            .map(part => part.toLowerCase());

        const hasSuspicious = innerExtensions.some(
            ext => SUSPICIOUS_INNER_EXTENSIONS.has(ext),
        );

        if (hasSuspicious) {

            throw new AttachmentValidationException(
                AttachmentValidationErrorCode.EXTENSION_DOUBLE_SUSPICIOUS,
                'Suspicious double extension detected.',
            );

        }

    }

    //--------------------------------------------------
    // Mime
    //--------------------------------------------------

    private validateMimeType(
        mime: string,
    ): void {

        if (!mime) {

            throw new AttachmentValidationException(
                AttachmentValidationErrorCode.MIME_MISSING,
                'Mime type is missing.',
            );

        }

        if (!ALLOWED_MIME_TYPES.includes(mime)) {

            throw new AttachmentValidationException(
                AttachmentValidationErrorCode.MIME_NOT_ALLOWED,
                `Mime type '${mime}' is not allowed.`,
            );

        }

    }

    //--------------------------------------------------
    // Mime vs Extension
    //--------------------------------------------------

    private validateMimeMatchesExtension(
        filename: string,
        mime: string,
    ): void {

        const extension = extname(filename).toLowerCase();
        const allowed = MIME_EXTENSION_MAP.get(mime);

        if (!allowed) {
            // Mime type isn't in our cross-check map but was
            // already verified against ALLOWED_MIME_TYPES above,
            // so we don't block it here — just skip the stricter check.
            return;
        }

        if (!allowed.includes(extension)) {

            throw new AttachmentValidationException(
                AttachmentValidationErrorCode.MIME_EXTENSION_MISMATCH,
                'File extension does not match mime type.',
            );

        }

    }

    //--------------------------------------------------
    // File Signature ("magic bytes")
    //--------------------------------------------------
    // Defends against a forged Content-Type header by
    // inspecting the actual binary content of the file.
    // This requires the buffer to be in memory
    // (multer's memoryStorage / diskStorage with a
    // buffer read), so it only runs when a buffer
    // is available.
    //--------------------------------------------------

    private validateFileSignature(
        file: Express.Multer.File,
    ): void {

        if (!file.buffer || file.buffer.length === 0) {
            // No in-memory buffer available (e.g. disk storage
            // without a follow-up read). Skip rather than fail
            // closed on infrastructure that doesn't supply one.
            this.logger.warn(
                `Skipping file signature check for "${file.originalname}" — no buffer available.`,
            );
            return;
        }

        const matchingSignature = FILE_SIGNATURES.find(
            signature => signature.mime === file.mimetype,
        );

        if (!matchingSignature) {
            // No known signature for this mime type — nothing to
            // cross-check against, so we don't block it.
            return;
        }

        const offset = matchingSignature.offset ?? 0;
        const candidate = file.buffer.subarray(
            offset,
            offset + matchingSignature.bytes.length,
        );

        const matches = matchingSignature.bytes.every(
            (byte, index) => candidate[index] === byte,
        );

        if (!matches) {

            this.logger.warn(
                `File signature mismatch for "${file.originalname}" — declared mime "${file.mimetype}" did not match its binary header.`,
            );

            throw new AttachmentValidationException(
                AttachmentValidationErrorCode.SIGNATURE_MISMATCH,
                'File content does not match its declared type.',
            );

        }

    }

    //--------------------------------------------------
    // Sanitize Filename
    //--------------------------------------------------
    // Utility for callers that want a safe display/storage
    // name rather than outright rejecting the upload.
    // Not invoked by validate() itself.
    //--------------------------------------------------

    sanitizeFilename(
        filename: string,
    ): string {

        return filename
            .trim()
            .replace(/\s+/g, ' ')
            .replace(/[<>:"/\\|?*\x00-\x1F]/g, '_');

    }

}