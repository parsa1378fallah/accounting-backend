import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { Prisma } from '@prisma/client';

import { AttachmentRepository } from '../repositories/attachment.repository';
import { AttachmentStorageService } from '../storage/attachment-storage.service';
import { AttachmentChecksumService } from './attachment-checksum.service';
import { AttachmentMapper } from '../mappers/attachment.mapper';
import { QueryAttachmentDto } from '../dto/query-attachment.dto';

// ─── MIME type groups ──────────────────────────────────────────────────────────
const MIME_GROUPS = {
    image: [
        'image/jpeg', 'image/png', 'image/webp',
        'image/gif', 'image/svg+xml', 'image/bmp', 'image/tiff',
    ],
    document: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain', 'text/csv',
    ],
    video: [
        'video/mp4', 'video/mpeg', 'video/ogg',
        'video/webm', 'video/x-msvideo',
    ],
    archive: [
        'application/zip', 'application/x-rar-compressed',
        'application/x-7z-compressed', 'application/x-tar',
        'application/gzip',
    ],
    previewable: [
        'image/jpeg', 'image/png', 'image/webp',
        'image/gif', 'image/svg+xml', 'application/pdf',
    ],
} as const

export type StorageDisk = 'local' | 's3' | 'minio' | 'azure'

export interface IntegrityCheckResult {
    id: string
    path: string
    existsOnStorage: boolean
    /** null = نمی‌توان بررسی کرد چون فایل روی storage وجود ندارد */
    checksumMatch: boolean | null
    status: 'ok' | 'missing' | 'corrupted'
}

@Injectable()
export class AttachmentQueryService {
    constructor(
        private readonly repository: AttachmentRepository,
        private readonly storage: AttachmentStorageService,
        private readonly checksumService: AttachmentChecksumService,
        private readonly mapper: AttachmentMapper,
    ) { }

    // =========================================================================
    // CORE QUERIES
    // =========================================================================

    async findAll(query: QueryAttachmentDto) {
        const where = this.buildWhere(query)
        const result = await this.repository.findMany(where)
        return this.mapper.toResponseList(result)
    }

    /** alias — همان findAll ولی با نام معنادار‌تر برای CQRS */
    async search(query: QueryAttachmentDto) {
        return this.findAll(query)
    }

    async findById(id: string) {
        const entity = await this.repository.findById(id)

        if (!entity) {
            throw new NotFoundException('Attachment not found.')
        }

        return this.mapper.toResponse(entity)
    }

    /** batch lookup — برای عملیاتی که چند id همزمان نیاز دارند */
    async findByIds(ids: string[]) {
        const result = await this.repository.findMany({
            id: { in: ids },
            deletedAt: null,
        })
        return this.mapper.toResponseList(result)
    }

    async exists(id: string): Promise<boolean> {
        const count = await this.repository.count({ id, deletedAt: null })
        return count > 0
    }

    async count(organizationId: string): Promise<number> {
        return this.repository.count({ organizationId, deletedAt: null })
    }

    // =========================================================================
    // FIELD-SPECIFIC FINDERS
    // =========================================================================

    async findByMimeType(organizationId: string, mimeType: string) {
        const result = await this.repository.findMany({
            organizationId,
            mimeType,
            deletedAt: null,
        })
        return this.mapper.toResponseList(result)
    }

    async findByExtension(organizationId: string, extension: string) {
        const result = await this.repository.findMany({
            organizationId,
            // اسکیما: extension بدون نقطه ذخیره می‌شود — normalize می‌کنیم
            extension: extension.replace(/^\./, '').toLowerCase(),
            deletedAt: null,
        })
        return this.mapper.toResponseList(result)
    }

    async findByFilename(organizationId: string, fileName: string) {
        const result = await this.repository.findMany({
            organizationId,
            fileName: { contains: fileName },
            deletedAt: null,
        })
        return this.mapper.toResponseList(result)
    }

    async findByOriginalName(organizationId: string, originalName: string) {
        const result = await this.repository.findMany({
            organizationId,
            originalName: { contains: originalName },
            deletedAt: null,
        })
        return this.mapper.toResponseList(result)
    }

    async findByChecksum(checksum: string) {
        const result = await this.repository.findMany({
            checksum,
            deletedAt: null,
        })
        return this.mapper.toResponseList(result)
    }

    async findByPath(path: string) {
        const result = await this.repository.findMany({
            path: { contains: path },
            deletedAt: null,
        })
        return this.mapper.toResponseList(result)
    }

    // ─── Access level ─────────────────────────────────────────────────────────

    async findPublic(organizationId: string) {
        const result = await this.repository.findMany({
            organizationId,
            isPublic: true,
            deletedAt: null,
        })
        return this.mapper.toResponseList(result)
    }

    async findPrivate(organizationId: string) {
        const result = await this.repository.findMany({
            organizationId,
            isPublic: false,
            deletedAt: null,
        })
        return this.mapper.toResponseList(result)
    }

    // ─── Uploader ─────────────────────────────────────────────────────────────

    async findByUploader(uploadedById: string, organizationId?: string) {
        const result = await this.repository.findMany({
            uploadedById,
            ...(organizationId ? { organizationId } : {}),
            deletedAt: null,
        })
        return this.mapper.toResponseList(result)
    }

    // ─── Storage disk ─────────────────────────────────────────────────────────

    /**
     * فایل‌هایی که روی یک disk خاص ذخیره شده‌اند.
     * مثلاً برای migration از local به S3.
     */
    async findByStorageDisk(
        organizationId: string,
        disk: StorageDisk,
    ) {
        const result = await this.repository.findMany({
            organizationId,
            disk,
            deletedAt: null,
        })
        return this.mapper.toResponseList(result)
    }

    // ─── Date range ───────────────────────────────────────────────────────────

    async findByDateRange(
        organizationId: string,
        from: Date,
        to: Date,
    ) {
        const result = await this.repository.findMany(
            {
                organizationId,
                deletedAt: null,
                createdAt: { gte: from, lte: to },
            }

        )
        return this.mapper.toResponseList(result)
    }

    // ─── Size range ───────────────────────────────────────────────────────────

    async findBySizeRange(
        organizationId: string,
        minBytes: number,
        maxBytes: number,
    ) {
        const result = await this.repository.findMany(
            {
                organizationId,
                deletedAt: null,
                size: { gte: minBytes, lte: maxBytes },
            },
            // { orderBy: { size: 'desc' } },
        )
        return this.mapper.toResponseList(result)
    }

    // =========================================================================
    // ENTITY-LINKED QUERIES
    // =========================================================================

    async findByEntity(
        entityId: string,
        entityType: 'journal' | 'invoice',
    ) {
        const where: Prisma.AttachmentWhereInput =
            entityType === 'journal'
                ? {
                    journalAttachments: {
                        some: { journalEntryId: entityId },
                    },
                    deletedAt: null,
                }
                : {
                    invoiceAttachments: {
                        some: { entityId },
                    },
                    deletedAt: null,
                }

        const result = await this.repository.findMany(where)
        return this.mapper.toResponseList(result)
    }

    // =========================================================================
    // SOFT-DELETE QUERIES
    // =========================================================================

    async findDeleted(organizationId: string) {
        const result = await this.repository.findMany({
            organizationId,
            deletedAt: { not: null },
        })
        return this.mapper.toResponseList(result)
    }

    // =========================================================================
    // TYPE-BASED WRAPPERS (UI shortcuts)
    // =========================================================================

    async findImages(organizationId: string) {
        return this.findByMimeGroup(organizationId, MIME_GROUPS.image)
    }

    async findDocuments(organizationId: string) {
        return this.findByMimeGroup(organizationId, MIME_GROUPS.document)
    }

    async findVideos(organizationId: string) {
        return this.findByMimeGroup(organizationId, MIME_GROUPS.video)
    }

    async findArchives(organizationId: string) {
        return this.findByMimeGroup(organizationId, MIME_GROUPS.archive)
    }

    async findPreviewable(organizationId: string) {
        return this.findByMimeGroup(organizationId, MIME_GROUPS.previewable)
    }

    // =========================================================================
    // RANKED / SORTED QUERIES
    // =========================================================================

    async findRecentlyUploaded(organizationId: string, limit = 10) {
        const result = await this.repository.findMany(
            { organizationId, deletedAt: null },
            // { orderBy: { createdAt: 'desc' }, take: limit },
        )
        return this.mapper.toResponseList(result)
    }

    async findRecentlyDownloaded(organizationId: string, limit = 10) {
        const result = await this.repository.findMany(
            {
                organizationId,
                deletedAt: null,
                lastDownloadedAt: { not: null },
            },
            // { orderBy: { lastDownloadedAt: 'desc' }, take: limit },
        )
        return this.mapper.toResponseList(result)
    }

    async findRecent(organizationId: string, days = 7) {
        const since = new Date()
        since.setDate(since.getDate() - days)

        const result = await this.repository.findMany(
            {
                organizationId,
                deletedAt: null,
                createdAt: { gte: since },
            },
            // { orderBy: { createdAt: 'desc' } },
        )
        return this.mapper.toResponseList(result)
    }

    async findLargest(organizationId: string, limit = 10) {
        const result = await this.repository.findMany(
            { organizationId, deletedAt: null },
            // { orderBy: { size: 'desc' }, take: limit },
        )
        return this.mapper.toResponseList(result)
    }

    async findMostDownloaded(organizationId: string, limit = 10) {
        const result = await this.repository.findMany(
            {
                organizationId,
                deletedAt: null,
                downloadCount: { gt: 0 },
            },
            // { orderBy: { downloadCount: 'desc' }, take: limit },
        )
        return this.mapper.toResponseList(result)
    }

    // =========================================================================
    // DOWNLOAD-BASED QUERIES
    // =========================================================================

    /** فایل‌هایی که هیچ‌وقت دانلود نشده‌اند */
    async findNeverDownloaded(organizationId: string) {
        const result = await this.repository.findMany({
            organizationId,
            deletedAt: null,
            downloadCount: 0,
        })
        return this.mapper.toResponseList(result)
    }

    /**
     * فایل‌هایی که هیچ دانلودی نداشته‌اند و قدیمی‌تر از N روز هستند.
     * برای Cleanup scheduler و گزارش فایل‌های بی‌استفاده.
     */
    async findUnused(organizationId: string, olderThanDays = 30) {
        const threshold = new Date()
        threshold.setDate(threshold.getDate() - olderThanDays)

        const result = await this.repository.findMany({
            organizationId,
            deletedAt: null,
            downloadCount: 0,
            createdAt: { lte: threshold },
        })
        return this.mapper.toResponseList(result)
    }

    // =========================================================================
    // TEMPORARY FILES
    // =========================================================================

    /**
     * فایل‌های موقت منقضی‌شده.
     * فرض: فیلد disk='temp' یا نام‌گذاری مسیر با /temp/ برای شناسایی استفاده می‌شود.
     * وقتی مدل Prisma فیلد expiresAt اضافه شد، where بر اساس آن به‌روزرسانی می‌شود.
     */
    async findExpiredTemporaryFiles() {
        const result = await this.repository.findMany({
            disk: 'temp',
            deletedAt: null,
            // اگر بعداً expiresAt اضافه شد:
            // expiresAt: { lte: new Date() },
        })
        return this.mapper.toResponseList(result)
    }

    // =========================================================================
    // INTEGRITY QUERIES
    // =========================================================================

    async findDuplicates(organizationId: string) {
        const groups = await this.repository.groupByChecksum(organizationId)

        const duplicateChecksums = groups
            .filter((g) => g._count._all > 1)
            .map((g) => g.checksum)
            .filter((c): c is string => c !== null)

        if (duplicateChecksums.length === 0) return []

        const result = await this.repository.findMany({
            organizationId,
            checksum: { in: duplicateChecksums },
            deletedAt: null,
        })

        const mapped = this.mapper.toResponseList(result)
        const byChecksum = new Map<string, typeof mapped>()

        for (const item of mapped) {
            const key = (item as any).checksum ?? 'unknown'
            const group = byChecksum.get(key) ?? []
            group.push(item)
            byChecksum.set(key, group)
        }

        return [...byChecksum.entries()].map(([checksum, files]) => ({
            checksum,
            count: files.length,
            files,
        }))
    }

    async findOrphanFiles(organizationId: string) {
        const result = await this.repository.findMany({
            organizationId,
            deletedAt: null,
            journalAttachments: { none: {} },
            invoiceAttachments: { none: {} },
        })
        return this.mapper.toResponseList(result)
    }

    /**
     * بررسی وجود فیزیکی فایل روی storage.
     * رکوردهایی که path شان روی disk وجود ندارد برمی‌گرداند.
     * هشدار: برای سازمان‌های بزرگ از pagination استفاده کنید.
     */
    async findBrokenFiles(organizationId: string): Promise<IntegrityCheckResult[]> {
        const all = await this.repository.findMany({
            organizationId,
            deletedAt: null,
        })

        const results: IntegrityCheckResult[] = []

        for (const file of all) {
            const existsOnStorage = await this.storage.exists(file.path)

            results.push({
                id: file.id,
                path: file.path,
                existsOnStorage,
                checksumMatch: null, // تنها با verifyIntegrity قابل بررسی است
                status: existsOnStorage ? 'ok' : 'missing',
            })
        }

        return results.filter((r) => r.status !== 'ok')
    }

    /**
     * مقایسه checksum دیتابیس با checksum واقعی فایل روی storage.
     * گران‌قیمت‌ترین عملیات — فقط برای audit یا عیب‌یابی اجرا شود.
     */
    async verifyIntegrity(id: string): Promise<IntegrityCheckResult> {
        const file = await this.repository.findById(id)

        if (!file) {
            throw new NotFoundException('Attachment not found.')
        }

        const existsOnStorage = await this.storage.exists(file.path)

        if (!existsOnStorage) {
            return {
                id: file.id,
                path: file.path,
                existsOnStorage: false,
                checksumMatch: null,
                status: 'missing',
            }
        }

        // اگر checksum در DB ذخیره نشده، نمی‌توانیم مقایسه کنیم
        if (!file.checksum) {
            return {
                id: file.id,
                path: file.path,
                existsOnStorage: true,
                checksumMatch: null,
                status: 'ok',
            }
        }

        const buffer = await this.storage.read(file.path)
        const actualHash = this.checksumService.calculateSha256(buffer)
        const checksumMatch = actualHash === file.checksum

        return {
            id: file.id,
            path: file.path,
            existsOnStorage: true,
            checksumMatch,
            status: checksumMatch ? 'ok' : 'corrupted',
        }
    }

    // =========================================================================
    // DETAIL / METADATA
    // =========================================================================

    async getDetails(id: string) {
        const entity = await this.repository.findByIdWithRelations(id)

        if (!entity) {
            throw new NotFoundException('Attachment not found.')
        }

        return entity
    }

    /**
     * فقط فیلدهای فنی — بدون mapper.
     * مصرف‌کننده: سرویس‌های داخلی (VirusService، DeduplicationService، ...).
     */
    async getMetadata(id: string) {
        const entity = await this.repository.findById(id)

        if (!entity) {
            throw new NotFoundException('Attachment not found.')
        }

        return {
            id: entity.id,
            fileName: entity.fileName,
            originalName: entity.originalName,
            extension: entity.extension,
            mimeType: entity.mimeType,
            size: entity.size,
            disk: entity.disk,
            path: entity.path,
            checksum: entity.checksum,
            isPublic: entity.isPublic,
            uploadedById: entity.uploadedById,
            createdAt: entity.createdAt,
        }
    }

    // =========================================================================
    // STATISTICS
    // =========================================================================

    async getOrganizationStatistics(organizationId: string) {
        const all = await this.repository.findMany({ organizationId })

        const active = all.filter((f) => !f.deletedAt)
        const deleted = all.filter((f) => f.deletedAt)

        const totalSize = active.reduce((s, f) => s + f.size, 0)
        const averageSize = active.length ? totalSize / active.length : 0
        const totalDownloads = active.reduce((s, f) => s + f.downloadCount, 0)

        return {
            totalFiles: active.length,
            deletedFiles: deleted.length,
            publicFiles: active.filter((f) => f.isPublic).length,
            privateFiles: active.filter((f) => !f.isPublic).length,
            totalSize,
            averageSize,
            totalDownloads,
            neverDownloaded: active.filter((f) => f.downloadCount === 0).length,
            byMimeType: this.groupCount(active, (f) => f.mimeType),
            byExtension: this.groupCount(active, (f) => f.extension),
            byDisk: this.groupCount(active, (f) => f.disk ?? 'local'),
        }
    }

    async getEntityStatistics(
        entityId: string,
        entityType: 'journal' | 'invoice',
    ) {
        const files = await this.findByEntity(entityId, entityType)

        const totalSize = files.reduce((s, f) => s + ((f as any).size ?? 0), 0)

        return {
            totalFiles: files.length,
            totalSize,
            byMimeType: this.groupCount(files, (f) => (f as any).mimeType ?? 'unknown'),
            byExtension: this.groupCount(files, (f) => (f as any).extension ?? 'unknown'),
        }
    }

    // =========================================================================
    // PRIVATE HELPERS
    // =========================================================================

    private async findByMimeGroup(
        organizationId: string,
        mimes: readonly string[],
    ) {
        const result = await this.repository.findMany({
            organizationId,
            deletedAt: null,
            mimeType: { in: [...mimes] },
        })
        return this.mapper.toResponseList(result)
    }

    private buildWhere(query: QueryAttachmentDto): Prisma.AttachmentWhereInput {
        const where: Prisma.AttachmentWhereInput = {}

        if (query.organizationId) where.organizationId = query.organizationId
        if (query.mimeType) where.mimeType = query.mimeType
        if (query.extension) where.extension = query.extension

        if (query.search) {
            where.OR = [
                { fileName: { contains: query.search } },
                { originalName: { contains: query.search } },
            ]
        }

        if (!query.includeDeleted) {
            where.deletedAt = null
        }

        return where
    }

    private groupCount<T>(
        items: T[],
        keyFn: (item: T) => string,
    ): Record<string, number> {
        return items.reduce<Record<string, number>>((acc, item) => {
            const key = keyFn(item)
            acc[key] = (acc[key] ?? 0) + 1
            return acc
        }, {})
    }
}
