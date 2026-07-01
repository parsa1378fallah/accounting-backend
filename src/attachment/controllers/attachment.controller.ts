import {
    Body,
    Controller,
    Delete,
    Get,
    Head,
    Headers,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
    Query,
    Res,
    UploadedFile,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import {
    FileInterceptor,
    FilesInterceptor,
} from '@nestjs/platform-express';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiCreatedResponse,
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Permissions } from 'src/auth/decorators/permisions.decorator';
import { PermissionGuard } from 'src/auth/guards/permision.guard';

import { AttachmentService } from '../services/attachment.service';
import { AttachmentUploadService } from '../services/attachment-upload.service';
import { AttachmentDownloadService } from '../services/attachment-download.service';
import * as attachmentQueryService from '../services/attachment-query.service';
import { AttachmentSummaryService } from '../services/attachment-summary.service';
import { AttachmentValidationService } from '../services/attachment-validation.service';
import { AttachmentChecksumService } from '../services/attachment-checksum.service';
import { AttachmentFilenameService } from '../services/attachment-filename.service';
import { AttachmentPathService } from '../services/attachment-path.service';
import { AttachmentStorageService } from '../storage/attachment-storage.service';

import { CreateAttachmentDto } from '../dto/create-attachment.dto';
import { UpdateAttachmentDto } from '../dto/update-attachment.dto';
import { QueryAttachmentDto } from '../dto/query-attachment.dto';
import { DuplicateAttachmentDto } from '../dto/duplicate-attachment.dto';
import type { AttachmentFilenameOptions } from '../interfaces/attachment-filename-options.interface';

// ─── inline DTOs (کوچک و فقط داخل این فایل استفاده می‌شوند) ──────────────────

class VerifyChecksumDto {
    checksum: string;
    algorithm: 'sha256' | 'sha1' | 'md5';
}

class FindByIdsDto {
    ids: string[];
}

class FindByDateRangeDto {
    from: string;   // ISO string
    to: string;
}

class FindBySizeRangeDto {
    minBytes: number;
    maxBytes: number;
}

// =============================================================================
// CONTROLLER
// =============================================================================

@ApiTags('Attachments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('attachments')
export class AttachmentController {
    constructor(
        private readonly attachmentService: AttachmentService,
        private readonly uploadService: AttachmentUploadService,
        private readonly downloadService: AttachmentDownloadService,
        private readonly queryService: attachmentQueryService.AttachmentQueryService,
        private readonly summaryService: AttachmentSummaryService,
        private readonly validationService: AttachmentValidationService,
        private readonly checksumService: AttachmentChecksumService,
        private readonly filenameService: AttachmentFilenameService,
        private readonly pathService: AttachmentPathService,
        private readonly storageService: AttachmentStorageService,
    ) { }

    // =========================================================================
    // UPLOAD
    // =========================================================================

    @Post('upload')
    @ApiOperation({ summary: 'Upload a single file' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } })
    @ApiCreatedResponse({ description: 'File uploaded successfully' })
    @ApiBadRequestResponse({ description: 'Validation failed' })
    @Permissions('attachments.upload')
    @UseInterceptors(FileInterceptor('file'))
    upload(
        @UploadedFile() file: Express.Multer.File,
        @CurrentUser('organizationId') organizationId: string,
    ) {
        return this.uploadService.upload(file, organizationId);
    }

    // ─────────────────────────────────────────────────────────────────────────

    @Post('upload/bulk')
    @ApiOperation({ summary: 'Upload multiple files (max 20)' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({ schema: { type: 'object', properties: { files: { type: 'array', items: { type: 'string', format: 'binary' } } } } })
    @ApiCreatedResponse({ description: 'Bulk upload result' })
    @Permissions('attachments.upload')
    @UseInterceptors(FilesInterceptor('files', 20))
    uploadMany(
        @UploadedFiles() files: Express.Multer.File[],
        @CurrentUser('organizationId') organizationId: string,
    ) {
        return this.uploadService.uploadMany(files, organizationId);
    }

    // ─────────────────────────────────────────────────────────────────────────

    @Post(':id/replace')
    @ApiOperation({ summary: 'Replace existing attachment with a new file' })
    @ApiConsumes('multipart/form-data')
    @ApiParam({ name: 'id', description: 'Attachment ID to replace' })
    @ApiOkResponse({ description: 'Replacement successful' })
    @ApiNotFoundResponse({ description: 'Attachment not found' })
    @Permissions('attachments.upload')
    @UseInterceptors(FileInterceptor('file'))
    replace(
        @Param('id') id: string,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return this.uploadService.replace(id, file);
    }

    // ─────────────────────────────────────────────────────────────────────────

    @Post(':id/duplicate')
    @ApiOperation({ summary: 'Clone DB record (no file copy) and link to another entity' })
    @ApiParam({ name: 'id', description: 'Source attachment ID' })
    @ApiCreatedResponse({ description: 'Duplicate created' })
    @Permissions('attachments.upload')
    duplicate(
        @Param('id') id: string,
        @Body() dto: DuplicateAttachmentDto,
    ) {
        return this.uploadService.duplicate(id, dto.targetEntityId);
    }

    // =========================================================================
    // CORE CRUD
    // =========================================================================

    @Post()
    @ApiOperation({ summary: 'Create metadata-only attachment record' })
    @ApiCreatedResponse({ description: 'Attachment record created' })
    @ApiBadRequestResponse({ description: 'Validation failed' })
    @Permissions('attachments.create')
    create(@Body() dto: CreateAttachmentDto) {
        return this.attachmentService.create(dto);
    }

    // ─────────────────────────────────────────────────────────────────────────

    @Get()
    @ApiOperation({ summary: 'List attachments with optional filters' })
    @ApiOkResponse({ description: 'Paginated attachment list' })
    @Permissions('attachments.read')
    findAll(@Query() query: QueryAttachmentDto) {
        return this.queryService.findAll(query);
    }

    // ─────────────────────────────────────────────────────────────────────────

    @Post('search')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Full-text search via request body (avoids URL length limits)' })
    @ApiOkResponse({ description: 'Search results' })
    @Permissions('attachments.read')
    search(@Body() dto: QueryAttachmentDto) {
        return this.queryService.search(dto);
    }

    // ─────────────────────────────────────────────────────────────────────────

    @Post('batch')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Fetch multiple attachments by IDs' })
    @ApiOkResponse({ description: 'Batch result' })
    @Permissions('attachments.read')
    findByIds(@Body() dto: FindByIdsDto) {
        return this.queryService.findByIds(dto.ids);
    }

    // =========================================================================
    // STATIC / FILTER ROUTES
    // NOTE: static routes MUST come before `:id` routes to avoid NestJS
    // routing conflicts.
    // =========================================================================

    // ─── Soft-deleted ─────────────────────────────────────────────────────────

    @Get('deleted')
    @ApiOperation({ summary: 'List soft-deleted attachments' })
    @ApiQuery({ name: 'organizationId', required: true })
    @Permissions('attachments.read')
    findDeleted(
        @Query('organizationId') organizationId: string,
    ) {
        return this.queryService.findDeleted(organizationId);
    }

    // ─── Integrity ────────────────────────────────────────────────────────────

    @Get('duplicates')
    @ApiOperation({ summary: 'List duplicate files grouped by checksum' })
    @ApiQuery({ name: 'organizationId', required: true })
    @Permissions('attachments.read')
    findDuplicates(
        @Query('organizationId') organizationId: string,
    ) {
        return this.queryService.findDuplicates(organizationId);
    }

    // ─────────────────────────────────────────────────────────────────────────

    @Get('orphans')
    @ApiOperation({ summary: 'List orphan files (not linked to any entity)' })
    @ApiQuery({ name: 'organizationId', required: true })
    @Permissions('attachments.read')
    findOrphanFiles(
        @Query('organizationId') organizationId: string,
    ) {
        return this.queryService.findOrphanFiles(organizationId);
    }

    // ─────────────────────────────────────────────────────────────────────────

    @Get('broken')
    @ApiOperation({ summary: 'List DB records whose physical file is missing on storage' })
    @ApiQuery({ name: 'organizationId', required: true })
    @Permissions('attachments.read')
    findBrokenFiles(
        @Query('organizationId') organizationId: string,
    ) {
        return this.queryService.findBrokenFiles(organizationId);
    }

    // ─── Recency ──────────────────────────────────────────────────────────────

    @Get('recent')
    @ApiOperation({ summary: 'Recently uploaded files (default: last 7 days)' })
    @ApiQuery({ name: 'organizationId', required: true })
    @ApiQuery({ name: 'days', required: false, type: Number })
    @Permissions('attachments.read')
    findRecent(
        @Query('organizationId') organizationId: string,
        @Query('days') days?: number,
    ) {
        return this.queryService.findRecent(organizationId, days ? +days : 7)
    }

    // ─────────────────────────────────────────────────────────────────────────

    @Get('recently-uploaded')
    @ApiOperation({ summary: 'Most recently uploaded files (sorted by createdAt)' })
    @ApiQuery({ name: 'organizationId', required: true })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @Permissions('attachments.read')
    findRecentlyUploaded(
        @Query('organizationId') organizationId: string,
        @Query('limit') limit?: number,
    ) {
        return this.queryService.findRecentlyUploaded(organizationId, limit ? +limit : 10)
    }

    // ─────────────────────────────────────────────────────────────────────────

    @Get('recently-downloaded')
    @ApiOperation({ summary: 'Most recently downloaded files (sorted by lastDownloadedAt)' })
    @ApiQuery({ name: 'organizationId', required: true })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @Permissions('attachments.read')
    findRecentlyDownloaded(
        @Query('organizationId') organizationId: string,
        @Query('limit') limit?: number,
    ) {
        return this.queryService.findRecentlyDownloaded(organizationId, limit ? +limit : 10)
    }

    // ─── Ranked ───────────────────────────────────────────────────────────────

    @Get('largest')
    @ApiOperation({ summary: 'Largest files by byte size' })
    @ApiQuery({ name: 'organizationId', required: true })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @Permissions('attachments.read')
    findLargest(
        @Query('organizationId') organizationId: string,
        @Query('limit') limit?: number,
    ) {
        return this.queryService.findLargest(organizationId, limit ? +limit : 10)
    }

    // ─────────────────────────────────────────────────────────────────────────

    @Get('most-downloaded')
    @ApiOperation({ summary: 'Most downloaded files (downloadCount DESC)' })
    @ApiQuery({ name: 'organizationId', required: true })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @Permissions('attachments.read')
    findMostDownloaded(
        @Query('organizationId') organizationId: string,
        @Query('limit') limit?: number,
    ) {
        return this.queryService.findMostDownloaded(organizationId, limit ? +limit : 10)
    }

    // ─── Download-status ─────────────────────────────────────────────────────

    @Get('never-downloaded')
    @ApiOperation({ summary: 'Files that have never been downloaded (downloadCount == 0)' })
    @ApiQuery({ name: 'organizationId', required: true })
    @Permissions('attachments.read')
    findNeverDownloaded(
        @Query('organizationId') organizationId: string,
    ) {
        return this.queryService.findNeverDownloaded(organizationId)
    }

    // ─────────────────────────────────────────────────────────────────────────

    @Get('unused')
    @ApiOperation({ summary: 'Files never downloaded and older than N days (default: 30)' })
    @ApiQuery({ name: 'organizationId', required: true })
    @ApiQuery({ name: 'days', required: false, type: Number })
    @Permissions('attachments.read')
    findUnused(
        @Query('organizationId') organizationId: string,
        @Query('days') days?: number,
    ) {
        return this.queryService.findUnused(organizationId, days ? +days : 30)
    }

    // ─── Access level ────────────────────────────────────────────────────────

    @Get('public')
    @ApiOperation({ summary: 'All public attachments for an organization' })
    @ApiQuery({ name: 'organizationId', required: true })
    @Permissions('attachments.read')
    findPublic(
        @Query('organizationId') organizationId: string,
    ) {
        return this.queryService.findPublic(organizationId)
    }

    // ─────────────────────────────────────────────────────────────────────────

    @Get('private')
    @ApiOperation({ summary: 'All private attachments for an organization' })
    @ApiQuery({ name: 'organizationId', required: true })
    @Permissions('attachments.read')
    findPrivate(
        @Query('organizationId') organizationId: string,
    ) {
        return this.queryService.findPrivate(organizationId)
    }

    // ─── Type shortcuts ───────────────────────────────────────────────────────

    @Get('images')
    @ApiOperation({ summary: 'All image attachments (jpeg, png, webp, gif, svg, bmp, tiff)' })
    @ApiQuery({ name: 'organizationId', required: true })
    @Permissions('attachments.read')
    findImages(
        @Query('organizationId') organizationId: string,
    ) {
        return this.queryService.findImages(organizationId)
    }

    // ─────────────────────────────────────────────────────────────────────────

    @Get('documents')
    @ApiOperation({ summary: 'All document attachments (pdf, word, excel, txt, csv)' })
    @ApiQuery({ name: 'organizationId', required: true })
    @Permissions('attachments.read')
    findDocuments(
        @Query('organizationId') organizationId: string,
    ) {
        return this.queryService.findDocuments(organizationId)
    }

    // ─────────────────────────────────────────────────────────────────────────

    @Get('videos')
    @ApiOperation({ summary: 'All video attachments (mp4, mpeg, ogg, webm, avi)' })
    @ApiQuery({ name: 'organizationId', required: true })
    @Permissions('attachments.read')
    findVideos(
        @Query('organizationId') organizationId: string,
    ) {
        return this.queryService.findVideos(organizationId)
    }

    // ─────────────────────────────────────────────────────────────────────────

    @Get('archives')
    @ApiOperation({ summary: 'All archive attachments (zip, rar, 7z, tar, gz)' })
    @ApiQuery({ name: 'organizationId', required: true })
    @Permissions('attachments.read')
    findArchives(
        @Query('organizationId') organizationId: string,
    ) {
        return this.queryService.findArchives(organizationId)
    }

    // ─────────────────────────────────────────────────────────────────────────

    @Get('previewable')
    @ApiOperation({ summary: 'Files renderable inline (images + pdf)' })
    @ApiQuery({ name: 'organizationId', required: true })
    @Permissions('attachments.read')
    findPreviewable(
        @Query('organizationId') organizationId: string,
    ) {
        return this.queryService.findPreviewable(organizationId)
    }

    // ─── Entity-linked ────────────────────────────────────────────────────────

    @Get('entity/:entityType/:entityId')
    @ApiOperation({ summary: 'All attachments linked to a specific entity' })
    @ApiParam({ name: 'entityType', enum: ['journal', 'invoice'] })
    @ApiParam({ name: 'entityId' })
    @Permissions('attachments.read')
    findByEntity(
        @Param('entityType') entityType: 'journal' | 'invoice',
        @Param('entityId') entityId: string,
    ) {
        return this.queryService.findByEntity(entityId, entityType)
    }

    // ─── Uploader ─────────────────────────────────────────────────────────────

    @Get('by-uploader/:uploadedById')
    @ApiOperation({ summary: 'All files uploaded by a specific user' })
    @ApiParam({ name: 'uploadedById' })
    @ApiQuery({ name: 'organizationId', required: false })
    @Permissions('attachments.read')
    findByUploader(
        @Param('uploadedById') uploadedById: string,
        @Query('organizationId') organizationId?: string,
    ) {
        return this.queryService.findByUploader(uploadedById, organizationId)
    }

    // ─── Storage disk ─────────────────────────────────────────────────────────

    @Get('by-disk/:disk')
    @ApiOperation({ summary: 'Files stored on a specific storage disk (local/s3/minio/azure)' })
    @ApiParam({ name: 'disk', enum: ['local', 's3', 'minio', 'azure'] })
    @ApiQuery({ name: 'organizationId', required: true })
    @Permissions('attachments.read')
    findByStorageDisk(
        @Param('disk') disk: attachmentQueryService.StorageDisk,
        @Query('organizationId') organizationId: string,
    ) {
        return this.queryService.findByStorageDisk(organizationId, disk)
    }

    // ─── Date/Size ranges ─────────────────────────────────────────────────────

    @Post('filter/date-range')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Files uploaded within a date range' })
    @ApiQuery({ name: 'organizationId', required: true })
    @Permissions('attachments.read')
    findByDateRange(
        @Query('organizationId') organizationId: string,
        @Body() dto: FindByDateRangeDto,
    ) {
        return this.queryService.findByDateRange(
            organizationId,
            new Date(dto.from),
            new Date(dto.to),
        )
    }

    // ─────────────────────────────────────────────────────────────────────────

    @Post('filter/size-range')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Files within a byte-size range' })
    @ApiQuery({ name: 'organizationId', required: true })
    @Permissions('attachments.read')
    findBySizeRange(
        @Query('organizationId') organizationId: string,
        @Body() dto: FindBySizeRangeDto,
    ) {
        return this.queryService.findBySizeRange(organizationId, dto.minBytes, dto.maxBytes)
    }

    // ─── Temporary ────────────────────────────────────────────────────────────

    @Get('temp/expired')
    @ApiOperation({ summary: 'Expired temporary files (disk=temp)' })
    @Permissions('attachments.admin')
    findExpiredTemporaryFiles() {
        return this.queryService.findExpiredTemporaryFiles()
    }

    // =========================================================================
    // STATISTICS & SUMMARY
    // =========================================================================

    @Get('statistics')
    @ApiOperation({ summary: 'Storage statistics for an organization' })
    @ApiQuery({ name: 'organizationId', required: true })
    @Permissions('attachments.read')
    getOrganizationStatistics(
        @Query('organizationId') organizationId: string,
    ) {
        return this.queryService.getOrganizationStatistics(organizationId)
    }

    // ─────────────────────────────────────────────────────────────────────────

    @Get('statistics/entity/:entityType/:entityId')
    @ApiOperation({ summary: 'Attachment statistics for a specific entity' })
    @ApiParam({ name: 'entityType', enum: ['journal', 'invoice'] })
    @ApiParam({ name: 'entityId' })
    @Permissions('attachments.read')
    getEntityStatistics(
        @Param('entityType') entityType: 'journal' | 'invoice',
        @Param('entityId') entityId: string,
    ) {
        return this.queryService.getEntityStatistics(entityId, entityType)
    }

    // ─────────────────────────────────────────────────────────────────────────

    @Get('summary')
    @ApiOperation({ summary: 'Quick summary (counts + sizes) for an organization' })
    @ApiQuery({ name: 'organizationId', required: true })
    @Permissions('attachments.read')
    getSummary(
        @Query('organizationId') organizationId: string,
    ) {
        return this.summaryService.getSummary(organizationId)
    }

    // =========================================================================
    // STORAGE OPERATIONS
    // =========================================================================

    @Get('storage/health')
    @ApiOperation({ summary: 'Storage provider health check' })
    @Permissions('attachments.admin')
    storageHealth() {
        return this.storageService.healthCheck()
    }

    // ─────────────────────────────────────────────────────────────────────────

    @Get('storage/usage')
    @ApiOperation({ summary: 'Current storage usage metrics' })
    @Permissions('attachments.admin')
    storageUsage() {
        return this.storageService.getStorageUsage()
    }

    // ─────────────────────────────────────────────────────────────────────────

    @Post('storage/cleanup')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Trigger storage provider cleanup (provider-specific)' })
    @ApiNoContentResponse({ description: 'Cleanup triggered' })
    @Permissions('attachments.admin')
    storageCleanup() {
        return this.storageService.cleanup()
    }

    // =========================================================================
    // VALIDATION & CHECKSUM UTILITIES
    // =========================================================================

    @Post('validate')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Validate a file without saving it' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } })
    @ApiOkResponse({ description: 'Validation passed' })
    @ApiBadRequestResponse({ description: 'Validation failed' })
    @UseInterceptors(FileInterceptor('file'))
    validateUpload(@UploadedFile() file: Express.Multer.File) {
        this.validationService.validate(file)
        return { valid: true, fileName: file.originalname, size: file.size, mimeType: file.mimetype }
    }

    // ─────────────────────────────────────────────────────────────────────────

    @Post('checksum/calculate')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Calculate SHA-256 / SHA-1 / MD5 checksums for an uploaded file' })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('file'))
    calculateChecksum(@UploadedFile() file: Express.Multer.File) {
        return this.checksumService.calculateAll(file.buffer)
    }

    // ─────────────────────────────────────────────────────────────────────────

    @Post('checksum/verify')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Verify a file against an expected checksum' })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('file'))
    verifyChecksum(
        @UploadedFile() file: Express.Multer.File,
        @Body() dto: VerifyChecksumDto,
    ) {
        const verifiers: Record<string, () => boolean> = {
            sha256: () => this.checksumService.verifySha256(file.buffer, dto.checksum),
            sha1: () => this.checksumService.verifySha1(file.buffer, dto.checksum),
            md5: () => this.checksumService.verifyMd5(file.buffer, dto.checksum),
        }
        return { matches: verifiers[dto.algorithm]?.() ?? false }
    }

    // =========================================================================
    // FILENAME & PATH UTILITIES
    // =========================================================================

    @Post('generate-filename')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Generate a safe storage filename based on chosen strategy' })
    generateFilename(@Body() options: AttachmentFilenameOptions) {
        return { filename: this.filenameService.generate(options) }
    }

    // ─────────────────────────────────────────────────────────────────────────

    @Post('generate-path')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Preview the storage path that would be assigned to a file' })
    generatePath(
        @Body() body: { organizationId: string; originalFilename: string },
    ) {
        return this.pathService.build(body.organizationId, body.originalFilename)
    }

    // =========================================================================
    // PER-FILE ROUTES  (`:id` — must be LAST to avoid swallowing static routes)
    // =========================================================================

    @Head(':id')
    @ApiOperation({ summary: 'Check attachment existence without downloading (HTTP 200 / 404)' })
    @ApiParam({ name: 'id' })
    @Permissions('attachments.read')
    async headAttachment(
        @Param('id') id: string,
        @Res({ passthrough: true }) res: Response,
    ) {
        const exists = await this.queryService.exists(id)
        res.status(exists ? HttpStatus.OK : HttpStatus.NOT_FOUND)
    }

    // ─────────────────────────────────────────────────────────────────────────

    @Get(':id')
    @ApiOperation({ summary: 'Get attachment by ID' })
    @ApiNotFoundResponse({ description: 'Attachment not found' })
    @Permissions('attachments.read')
    findOne(@Param('id') id: string) {
        return this.queryService.findById(id)
    }

    // ─────────────────────────────────────────────────────────────────────────

    @Get(':id/details')
    @ApiOperation({ summary: 'Full attachment details including all relations' })
    @ApiNotFoundResponse({ description: 'Attachment not found' })
    @Permissions('attachments.read')
    getDetails(@Param('id') id: string) {
        return this.queryService.getDetails(id)
    }

    // ─────────────────────────────────────────────────────────────────────────

    @Get(':id/metadata')
    @ApiOperation({ summary: 'Raw technical metadata (checksum, disk, path, mime, size)' })
    @ApiNotFoundResponse({ description: 'Attachment not found' })
    @Permissions('attachments.read')
    getMetadata(@Param('id') id: string) {
        return this.queryService.getMetadata(id)
    }

    // ─────────────────────────────────────────────────────────────────────────

    @Get(':id/exists')
    @ApiOperation({ summary: 'Returns { exists: boolean } for the given ID' })
    @Permissions('attachments.read')
    checkExists(@Param('id') id: string) {
        return this.queryService.exists(id).then((exists) => ({ exists }))
    }

    // ─────────────────────────────────────────────────────────────────────────

    @Get(':id/integrity')
    @ApiOperation({ summary: 'Verify physical file integrity (DB checksum vs storage checksum)' })
    @ApiNotFoundResponse({ description: 'Attachment not found' })
    @Permissions('attachments.admin')
    verifyIntegrity(@Param('id') id: string) {
        return this.queryService.verifyIntegrity(id)
    }

    // ─────────────────────────────────────────────────────────────────────────

    @Get(':id/download')
    @ApiOperation({ summary: 'Download file (supports HTTP Range for video/audio)' })
    @ApiNotFoundResponse({ description: 'File not found' })
    @Permissions('attachments.download')
    download(
        @Param('id') id: string,
        @Res() res: Response,
        @Headers('range') range?: string,
    ) {
        return this.downloadService.download(id, res, range)
    }

    // ─────────────────────────────────────────────────────────────────────────

    @Get(':id/stream')
    @ApiOperation({ summary: 'Stream file (alias of download — explicitly for media players)' })
    @ApiNotFoundResponse({ description: 'File not found' })
    @Permissions('attachments.download')
    stream(
        @Param('id') id: string,
        @Res() res: Response,
        @Headers('range') range?: string,
    ) {
        // intentionally reuses the download pipeline which already handles Range
        return this.downloadService.download(id, res, range)
    }

    // ─────────────────────────────────────────────────────────────────────────

    @Get(':id/preview')
    @ApiOperation({ summary: 'Inline preview (images + PDF open in browser; others force-download)' })
    @ApiNotFoundResponse({ description: 'File not found' })
    @Permissions('attachments.download')
    preview(
        @Param('id') id: string,
        @Res() res: Response,
    ) {
        return this.downloadService.preview(id, res)
    }

    // ─────────────────────────────────────────────────────────────────────────

    @Patch(':id')
    @ApiOperation({ summary: 'Update attachment metadata (originalName, isPublic)' })
    @ApiNotFoundResponse({ description: 'Attachment not found' })
    @Permissions('attachments.update')
    update(
        @Param('id') id: string,
        @Body() dto: UpdateAttachmentDto,
    ) {
        return this.attachmentService.update(id, dto)
    }

    // ─────────────────────────────────────────────────────────────────────────

    @Delete(':id')
    @ApiOperation({ summary: 'Soft-delete attachment' })
    @ApiOkResponse({ description: 'Attachment soft-deleted' })
    @ApiNotFoundResponse({ description: 'Attachment not found' })
    @Permissions('attachments.delete')
    async remove(@Param('id') id: string) {
        await this.attachmentService.remove(id)
        return { success: true }
    }

    // ─────────────────────────────────────────────────────────────────────────

    @Post(':id/restore')
    @ApiOperation({ summary: 'Restore soft-deleted attachment' })
    @ApiNotFoundResponse({ description: 'Attachment not found' })
    @Permissions('attachments.update')
    restore(@Param('id') id: string) {
        return this.attachmentService.restore(id)
    }

    // ─────────────────────────────────────────────────────────────────────────

    @Delete(':id/force')
    @ApiOperation({ summary: 'Permanently delete attachment (irreversible)' })
    @ApiNoContentResponse({ description: 'Attachment permanently deleted' })
    @ApiNotFoundResponse({ description: 'Attachment not found' })
    @HttpCode(HttpStatus.NO_CONTENT)
    @Permissions('attachments.admin')
    async forceDelete(@Param('id') id: string) {
        await this.attachmentService.forceDelete(id)
    }
}