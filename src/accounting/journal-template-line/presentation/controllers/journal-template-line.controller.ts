import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    HttpCode,
    HttpStatus,
    UseGuards,
    UseInterceptors,
    Logger,
    Req,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiParam,
    ApiQuery,
} from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import type { Request } from 'express';
import { Decimal } from 'decimal.js';

// Use Cases
import {
    CreateJournalTemplateLineUseCase,
    CreateJournalTemplateLineCommand,
} from '../../application/use-cases/create-journal-template-line.use-case';
import {
    UpdateJournalTemplateLineUseCase,
    UpdateJournalTemplateLineCommand,
} from '../../application/use-cases/update-journal-template-line.use-case';
import {
    DeleteJournalTemplateLineUseCase,
    DeleteJournalTemplateLineCommand,
} from '../../application/use-cases/delete-journal-template-line.use-case';
import {
    GetJournalTemplateLineUseCase,
    GetJournalTemplateLineQuery,
} from '../../application/use-cases/get-journal-template-line.use-case';
import {
    ListJournalTemplateLinesUseCase,
    ListJournalTemplateLinesQuery,
} from '../../application/use-cases/list-journal-template-lines.use-case';
import {
    PreviewCalculationUseCase,
    PreviewCalculationQuery,
} from '../../application/use-cases/preview-calculation.use-case';

// DTOs - Requests
import { CreateJournalTemplateLineDto } from '../dtos/request/create-journal-template-line.dto';
import { UpdateJournalTemplateLineDto } from '../dtos/request/update-journal-template-line.dto';
import { QueryJournalTemplateLineDto } from '../dtos/request/query-journal-template-line.dto';

// DTOs - Responses
import { JournalTemplateLineResponseDto } from '../dtos/response/journal-template-line.response.dto';
import { JournalTemplateLineListResponseDto } from '../dtos/response/journal-template-line-list.response.dto';
import { CalculationPreviewResponseDto } from '../dtos/response/calculation-preview.response.dto';

// Interceptors & Pipes
import { JournalTemplateLineTransformInterceptor } from '../interceptors/journal-template-line-transform.interceptor';
import { FormulaParserPipe } from '../pipes/formula-parser.pipe';

// Guards
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

// Decorators
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

interface AuthenticatedUser {
    id: string;
    organizationId: string;
    email: string;
    roles?: string[];
}

@Controller('api/v1/journal-template-lines')
@ApiTags('Journal Template Lines')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(JournalTemplateLineTransformInterceptor)
export class JournalTemplateLineController {
    private readonly logger = new Logger(JournalTemplateLineController.name);

    constructor(
        private readonly createUseCase: CreateJournalTemplateLineUseCase,
        private readonly updateUseCase: UpdateJournalTemplateLineUseCase,
        private readonly deleteUseCase: DeleteJournalTemplateLineUseCase,
        private readonly getUseCase: GetJournalTemplateLineUseCase,
        private readonly listUseCase: ListJournalTemplateLinesUseCase,
        private readonly previewUseCase: PreviewCalculationUseCase,
    ) { }

    /**
     * ایجاد یک خط قالب جدید
     */
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'Create journal template line',
        description:
            'Create a new journal template line with specified configuration (FIXED, PERCENTAGE, or FORMULA amount type)',
    })
    @ApiResponse({
        status: 201,
        description: 'Journal template line created successfully',
        type: JournalTemplateLineResponseDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Validation error - Invalid DTO, missing required fields, or formula syntax error',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized - Invalid or missing JWT token',
    })
    @ApiResponse({
        status: 404,
        description: 'Referenced entity not found (account, cost center, project, or currency)',
    })
    async create(
        @Body(FormulaParserPipe) dto: CreateJournalTemplateLineDto,
        @CurrentUser() user: AuthenticatedUser,
    ): Promise<JournalTemplateLineResponseDto> {
        this.logger.log(
            `[${user.id}] Creating journal template line for template: ${dto.templateId}`,
        );

        try {
            const command = new CreateJournalTemplateLineCommand(
                dto.templateId,
                dto.accountId,
                dto.isDebit,
                dto.amountType,
                dto.amount,
                dto.percentage,
                dto.formula,
                dto.description,
                dto.sortOrder,
                dto.costCenterId,
                dto.projectId,
                dto.currencyId,
                user.organizationId,
            );

            const result = await this.createUseCase.execute(command);
            this.logger.log(`[${user.id}] Journal template line created: ${result.id}`);
            return result;
        } catch (error) {
            this.logger.error(
                `[${user.id}] Failed to create journal template line: ${error.message}`,
            );
            throw error;
        }
    }

    /**
     * دریافت یک خط قالب با آی‌دی
     */
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Get journal template line by ID',
        description: 'Retrieve a specific journal template line by its ID',
    })
    @ApiParam({
        name: 'id',
        description: 'Journal template line ID (UUID)',
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    @ApiResponse({
        status: 200,
        description: 'Journal template line retrieved successfully',
        type: JournalTemplateLineResponseDto,
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    @ApiResponse({
        status: 404,
        description: 'Journal template line not found',
    })
    async getById(
        @Param('id') id: string,
        @CurrentUser() user: AuthenticatedUser,
    ): Promise<JournalTemplateLineResponseDto> {
        this.logger.log(`[${user.id}] Getting journal template line: ${id}`);

        try {
            const query = new GetJournalTemplateLineQuery(id);
            const result = await this.getUseCase.execute(query);
            return result;
        } catch (error) {
            this.logger.error(
                `[${user.id}] Failed to get journal template line: ${error.message}`,
            );
            throw error;
        }
    }

    /**
     * دریافت لیست خطوط برای یک قالب
     */
    @Get('template/:templateId')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'List journal template lines',
        description:
            'Get list of journal template lines for a specific template with pagination support',
    })
    @ApiParam({
        name: 'templateId',
        description: 'Template ID (UUID)',
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    @ApiQuery({
        name: 'page',
        description: 'Page number (1-based index)',
        required: false,
        example: 1,
        type: Number,
    })
    @ApiQuery({
        name: 'limit',
        description: 'Items per page',
        required: false,
        example: 10,
        type: Number,
    })
    @ApiQuery({
        name: 'sortBy',
        description: 'Field to sort by (sortOrder, createdAt, etc.)',
        required: false,
        example: 'sortOrder',
    })
    @ApiQuery({
        name: 'sortOrder',
        description: 'Sort order (asc or desc)',
        required: false,
        enum: ['asc', 'desc'],
    })
    @ApiResponse({
        status: 200,
        description: 'Journal template lines retrieved successfully with pagination metadata',
        type: JournalTemplateLineListResponseDto,
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    @ApiResponse({
        status: 404,
        description: 'Template not found',
    })
    async listByTemplate(
        @Param('templateId') templateId: string,
        @Query() queryDto: QueryJournalTemplateLineDto,
        @CurrentUser() user: AuthenticatedUser,
    ): Promise<JournalTemplateLineListResponseDto> {
        this.logger.log(
            `[${user.id}] Listing journal template lines for template: ${templateId}`,
        );

        try {
            const query = new ListJournalTemplateLinesQuery(
                templateId,
                user.organizationId,
                queryDto.page || 1,
                queryDto.limit || 10,
            );

            const result = await this.listUseCase.execute(query);
            this.logger.log(
                `[${user.id}] Retrieved ${result.data.length} journal template lines`,
            );
            return result;
        } catch (error) {
            this.logger.error(
                `[${user.id}] Failed to list journal template lines: ${error.message}`,
            );
            throw error;
        }
    }

    /**
     * به‌روزرسانی یک خط قالب
     */
    @Put(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Update journal template line',
        description: 'Update an existing journal template line (partial update supported)',
    })
    @ApiParam({
        name: 'id',
        description: 'Journal template line ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    @ApiResponse({
        status: 200,
        description: 'Journal template line updated successfully',
        type: JournalTemplateLineResponseDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Validation error',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    @ApiResponse({
        status: 404,
        description: 'Journal template line not found',
    })
    async update(
        @Param('id') id: string,
        @Body(FormulaParserPipe) dto: UpdateJournalTemplateLineDto,
        @CurrentUser() user: AuthenticatedUser,
    ): Promise<JournalTemplateLineResponseDto> {
        this.logger.log(
            `[${user.id}] Updating journal template line: ${id}`,
        );

        try {
            const command = new UpdateJournalTemplateLineCommand(id, {
                isDebit: dto.isDebit,
                amountType: dto.amountType,
                amount: dto.amount,
                percentage: dto.percentage,
                formula: dto.formula,
                description: dto.description ?? undefined,
                sortOrder: dto.sortOrder,
                costCenterId: dto.costCenterId,
                projectId: dto.projectId,
                currencyId: dto.currencyId,
            });

            const result = await this.updateUseCase.execute(command);
            this.logger.log(`[${user.id}] Journal template line updated: ${id}`);
            return result;
        } catch (error) {
            this.logger.error(
                `[${user.id}] Failed to update journal template line: ${error.message}`,
            );
            throw error;
        }
    }

    /**
     * حذف نرم یک خط قالب
     */
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({
        summary: 'Delete journal template line',
        description: 'Soft delete a journal template line (marked as deleted, not removed from database)',
    })
    @ApiParam({
        name: 'id',
        description: 'Journal template line ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    @ApiResponse({
        status: 204,
        description: 'Journal template line deleted successfully (no content returned)',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    @ApiResponse({
        status: 404,
        description: 'Journal template line not found',
    })
    async delete(
        @Param('id') id: string,
        @CurrentUser() user: AuthenticatedUser,
    ): Promise<void> {
        this.logger.log(`[${user.id}] Deleting journal template line: ${id}`);

        try {
            const command = new DeleteJournalTemplateLineCommand(id);
            await this.deleteUseCase.execute(command);
            this.logger.log(`[${user.id}] Journal template line deleted: ${id}`);
        } catch (error) {
            this.logger.error(
                `[${user.id}] Failed to delete journal template line: ${error.message}`,
            );
            throw error;
        }
    }

    /**
     * پیش‌نمایش محاسبات
     */
    @Post(':templateId/preview-calculation')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Preview calculation',
        description:
            'Preview calculation results for a template with given variables to verify debit-credit balance before actual transaction',
    })
    @ApiParam({
        name: 'templateId',
        description: 'Template ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    @ApiResponse({
        status: 200,
        description:
            'Calculation preview generated successfully with total debit, credit, and balance status',
        type: CalculationPreviewResponseDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Invalid variables or calculation parameters',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    @ApiResponse({
        status: 404,
        description: 'Template not found',
    })
    async previewCalculation(
        @Param('templateId') templateId: string,
        @Body()
        dto: {
            variables?: Record<string, number | string>;
            currencyPrecision?: number;
        },
        @CurrentUser() user: AuthenticatedUser,
    ): Promise<CalculationPreviewResponseDto> {
        this.logger.log(
            `[${user.id}] Previewing calculation for template: ${templateId}`,
        );

        try {
            const variables: Record<string, Decimal | number> = {};

            if (dto.variables) {
                Object.entries(dto.variables).forEach(([key, value]) => {
                    variables[key] =
                        typeof value === 'string' ? new Decimal(value) : value;
                });
            }

            const query = new PreviewCalculationQuery(
                templateId,
                user.organizationId,
                variables,
                dto.currencyPrecision || 2,
            );

            const result = await this.previewUseCase.execute(query);
            this.logger.log(
                `[${user.id}] Calculation preview completed - Balanced: ${result.isBalanced}`,
            );
            return result;
        } catch (error) {
            this.logger.error(
                `[${user.id}] Failed to preview calculation: ${error.message}`,
            );
            throw error;
        }
    }
}