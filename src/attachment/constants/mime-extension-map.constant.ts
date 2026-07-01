export const MIME_EXTENSION_MAP = new Map<string, string[]>([
    ['application/pdf', ['.pdf']],
    ['image/jpeg', ['.jpg', '.jpeg']],
    ['image/png', ['.png']],
    ['image/webp', ['.webp']],
    ['image/gif', ['.gif']],
    [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ['.xlsx'],
    ],
    ['application/vnd.ms-excel', ['.xls']],
    [
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ['.docx'],
    ],
    ['application/msword', ['.doc']],
    ['text/plain', ['.txt']],
    ['text/csv', ['.csv']],
]);
