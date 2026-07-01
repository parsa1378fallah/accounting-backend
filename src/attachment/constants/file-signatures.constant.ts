import { FileSignature } from "../interfaces/file-signature.interface";

export const FILE_SIGNATURES: FileSignature[] = [
    { mime: 'application/pdf', bytes: [0x25, 0x50, 0x44, 0x46] }, // %PDF
    { mime: 'image/png', bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
    { mime: 'image/jpeg', bytes: [0xff, 0xd8, 0xff] },
    { mime: 'image/gif', bytes: [0x47, 0x49, 0x46, 0x38] }, // GIF8
    { mime: 'image/webp', bytes: [0x52, 0x49, 0x46, 0x46] }, // RIFF (WEBP marker follows at offset 8)
    // ZIP-based OOXML formats (docx/xlsx) — PK\x03\x04
    { mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', bytes: [0x50, 0x4b, 0x03, 0x04] },
    { mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', bytes: [0x50, 0x4b, 0x03, 0x04] },
    // Legacy OLE Compound File Binary (doc/xls)
    { mime: 'application/msword', bytes: [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1] },
    { mime: 'application/vnd.ms-excel', bytes: [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1] },
];