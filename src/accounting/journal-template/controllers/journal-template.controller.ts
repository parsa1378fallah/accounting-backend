// src/modules/accounting/journal-template/controllers/journal-template.controller.ts
import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermissionGuard } from 'src/auth/guards/permision.guard';
import { Permissions } from 'src/auth/decorators/permisions.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

import { JournalTemplateService } from '../services/journal-template.service';
import { JournalTemplateResolverService } from '../services/journal-template-resolver.service';
import { RecurringJournalService } from '../services/recurring-journal.service';

import { CreateJournalTemplateDto } from '../dto/create-journal-template.dto';
import { UpdateJournalTemplateDto } from '../dto/update-journal-template.dto';
import { JournalTemplateQueryDto } from '../dto/journal-template-query.dto';
import { ApplyTemplateDto } from '../dto/apply-template.dto';

@ApiTags('Journal Templates')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('accounting/journal-templates')
export class JournalTemplateController {
    constructor(
        private readonly journalTemplateService: JournalTemplateService,
        private readonly resolverService: JournalTemplateResolverService,
        private readonly recurringJournalService: RecurringJournalService,
    ) { }

    // =========================================================================
    // CRUD Templates
    // =========================================================================

    @Post()
    @ApiOperation({ summary: 'ایجاد قالب جدید سند حسابداری' })
    @ApiCreatedResponse({ description: 'قالب با موفقیت ایجاد شد' })
    @ApiBadRequestResponse({ description: 'خطای اعتبارسنجی (تعادل بدهکار/بستانکار)' })
    @Permissions('accounting.journal-templates.create')
    create(
        @Body() dto: CreateJournalTemplateDto,
        @CurrentUser('id') userId: string,
        @CurrentUser('organizationId') organizationId: string,
    ) {
        return this.journalTemplateService.create(dto, userId, organizationId);
    }

    @Get()
    @ApiOperation({ summary: 'دریافت لیست قالب‌ها با فیلتر و pagination' })
    @ApiOkResponse({ description: 'لیست قالب‌ها' })
    @Permissions('accounting.journal-templates.read')
    findAll(
        @Query() query: JournalTemplateQueryDto,
        @CurrentUser('organizationId') organizationId: string,
    ) {
        return this.journalTemplateService.findAll(query, organizationId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'دریافت جزئیات یک قالب' })
    @ApiParam({ name: 'id' })
    @ApiNotFoundResponse({ description: 'قالب یافت نشد' })
    @Permissions('accounting.journal-templates.read')
    findOne(
        @Param('id') id: string,
        @CurrentUser('organizationId') organizationId: string,
    ) {
        return this.journalTemplateService.findOne(id, organizationId);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'به‌روزرسانی قالب (شامل خطوط)' })
    @ApiParam({ name: 'id' })
    @ApiOkResponse({ description: 'قالب به‌روزرسانی شد' })
    @ApiNotFoundResponse({ description: 'قالب یافت نشد' })
    @Permissions('accounting.journal-templates.update')
    update(
        @Param('id') id: string,
        @Body() dto: UpdateJournalTemplateDto,
        @CurrentUser('id') userId: string,
        @CurrentUser('organizationId') organizationId: string,
    ) {
        return this.journalTemplateService.update(id, dto, userId, organizationId);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'حذف نرم قالب' })
    @ApiParam({ name: 'id' })
    @Permissions('accounting.journal-templates.delete')
    remove(
        @Param('id') id: string,
        @CurrentUser('id') userId: string,
        @CurrentUser('organizationId') organizationId: string,
    ) {
        return this.journalTemplateService.remove(id, userId, organizationId);
    }

    // =========================================================================
    // Apply Template (مهم‌ترین عملیات)
    // =========================================================================

    @Post('apply')
    @ApiOperation({ summary: 'اعمال قالب و ایجاد سند حسابداری واقعی' })
    @ApiCreatedResponse({ description: 'سند حسابداری ایجاد شد' })
    @Permissions('accounting.journal-entries.create')
    applyTemplate(
        @Body() dto: ApplyTemplateDto,
        @CurrentUser('id') userId: string,
        @CurrentUser('organizationId') organizationId: string,
    ) {
        return this.resolverService.applyTemplate(dto, userId, organizationId);
    }

    // =========================================================================
    // Recurring Journal
    // =========================================================================

    @Post(':templateId/recurring')
    @ApiOperation({ summary: 'ایجاد سند تکراری از روی قالب' })
    @ApiCreatedResponse({ description: 'سند تکراری ایجاد شد' })
    @Permissions('accounting.recurring-journals.create')
    createRecurring(
        @Param('templateId') templateId: string,
        @Body() dto: any, // بعداً DTO اختصاصی بسازید
        @CurrentUser('id') userId: string,
        @CurrentUser('organizationId') organizationId: string,
    ) {
        // منطق ایجاد RecurringJournal
        return this.recurringJournalService.createFromTemplate(templateId, dto, userId, organizationId);
    }

    @Get('recurring')
    @ApiOperation({ summary: 'لیست اسناد تکراری' })
    @Permissions('accounting.recurring-journals.read')
    findRecurring(
        @Query() query: any,
        @CurrentUser('organizationId') organizationId: string,
    ) {
        return this.recurringJournalService.findAll(query, organizationId);
    }
}