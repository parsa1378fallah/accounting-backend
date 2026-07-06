import {
    Controller,
    Post,
    Body,
    HttpCode,
    HttpStatus,
    UseGuards,
    UseInterceptors,
    Logger,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
} from '@nestjs/swagger';

// Use Cases
import {
    BulkCreateJournalTemplateLinesUseCase,
    BulkCreateJournalTemplateLinesCommand,
} from '../../application/use-cases/bulk-create-journal-template-lines.use-case';
import {
    ReorderJournalTemplateLinesUseCase,
    ReorderJournalTemplateLinesCommand,
} from '../../application/use-cases/reorder-journal-template-lines.use-case';

// DTOs - Requests
import { BulkCreateJournalTemplateLineDto } from '../dtos/request/bulk-create-journal-template-line.dto';
import { ReorderJournalTemplateLineDto } from '../dtos/request/reorder-journal-template-line.dto';

// DTOs - Responses
import { JournalTemplateLineResponseDto } from '../dtos/response/journal-template-line.response.dto';

// Interceptors
import { JournalTemplateLineTransformInterceptor } from '../interceptors/journal-template-line-transform.interceptor';

// Guards
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

// Decorators
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

// Types
import { CreateJournalTemplateLineCommand } from '../../application/use-cases/create-journal-template-line.use-case';

interface AuthenticatedUser {
    id: string;
    organizationId: string;
    email: string;
    roles?: string[];
}

interface BulkOperationResponse {
    success: boolean;
    message: string;
    data?: any;
    count?: number;
}

@Controller('api/v1/journal-template-lines')
@ApiTags('Journal Template Lines - Bulk Operations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(JournalTemplateLineTransformInterceptor)
export class JournalTemplateLineBulkController {
    private readonly logger = new Logger(
        JournalTemplateLineBulkController.name,
    );

    constructor(
        private readonly bulkCreateUseCase: BulkCreateJournalTemplateLinesUseCase,
        private readonly reorderUseCase: ReorderJournalTemplateLinesUseCase,
    ) { }

    /**
     * ایجاد چندین خط قالب به‌صورت دسته‌ای
     */
    @Post('bulk/create')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'Bulk create journal template lines',
        description:
            'Create multiple journal template lines at once in a single transaction',
    })
    @ApiResponse({
        status: 201,
        description: 'Journal template lines created successfully',
        type: [JournalTemplateLineResponseDto],
    })
    @ApiResponse({
        status: 400,
        description:
            'Validation error - Invalid DTO, missing required fields, or duplicate entries',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized - Invalid or missing JWT token',
    })
    @ApiResponse({
        status: 404,
        description: 'Referenced entity not found (template, account, etc.)',
    })
    @ApiResponse({
        status: 422,
        description:
            'Unprocessable Entity - Partial failure in bulk operation (some items created, some failed)',
    })
    async bulkCreate(
        @Body() dto: BulkCreateJournalTemplateLineDto,
        @CurrentUser() user: AuthenticatedUser,
    ): Promise<JournalTemplateLineResponseDto[]> {
        this.logger.log(
            `[${user.id}] Bulk creating ${dto.lines.length} journal template lines for organization: ${user.organizationId}`,
        );

        try {
            if (!dto.lines || dto.lines.length === 0) {
                throw new Error('lines array cannot be empty');
            }

            if (dto.lines.length > 1000) {
                throw new Error(
                    'Bulk operation limited to 1000 lines per request',
                );
            }

            // تبدیل DTO ها به Commands
            const createCommands: CreateJournalTemplateLineCommand[] = dto.lines.map(
                (line, index) => {
                    try {
                        return new CreateJournalTemplateLineCommand(
                            line.templateId,
                            line.accountId,
                            line.isDebit,
                            line.amountType,
                            line.amount,
                            line.percentage,
                            line.formula,
                            line.description,
                            line.sortOrder,
                            line.costCenterId,
                            line.projectId,
                            line.currencyId,
                            user.organizationId,
                        );
                    } catch (error) {
                        this.logger.error(
                            `[${user.id}] Error creating command for line ${index}: ${error.message}`,
                        );
                        throw new Error(
                            `Invalid line at index ${index}: ${error.message}`,
                        );
                    }
                },
            );

            const command = new BulkCreateJournalTemplateLinesCommand(
                createCommands,
            );
            const results = await this.bulkCreateUseCase.execute(command);

            this.logger.log(
                `[${user.id}] Successfully bulk created ${results.length} journal template lines`,
            );

            return results;
        } catch (error) {
            this.logger.error(
                `[${user.id}] Bulk create failed: ${error.message}`,
            );
            throw error;
        }
    }

    /**
     * ترتیب‌بندی مجدد خطوط قالب
     */
    @Post('bulk/reorder')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Reorder journal template lines',
        description:
            'Reorder multiple journal template lines by updating their sort order',
    })
    @ApiResponse({
        status: 200,
        description: 'Journal template lines reordered successfully',
        schema: {
            properties: {
                success: { type: 'boolean', example: true },
                message: {
                    type: 'string',
                    example: 'Lines reordered successfully',
                },
                reorderedCount: { type: 'number', example: 5 },
            },
        },
    })
    @ApiResponse({
        status: 400,
        description: 'Validation error - Empty items or invalid sort orders',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    @ApiResponse({
        status: 404,
        description: 'Template or lines not found',
    })
    async reorder(
        @Body() dto: ReorderJournalTemplateLineDto,
        @CurrentUser() user: AuthenticatedUser,
    ): Promise<BulkOperationResponse> {
        this.logger.log(
            `[${user.id}] Reordering ${dto.items.length} journal template lines for template: ${dto.templateId}`,
        );

        try {
            if (!dto.items || dto.items.length === 0) {
                throw new Error('items array cannot be empty');
            }

            // بررسی تکراری نبودن sort orders
            const sortOrders = dto.items.map(item => item.sortOrder);
            if (new Set(sortOrders).size !== sortOrders.length) {
                throw new Error('Duplicate sort orders detected');
            }

            // بررسی validity sort orders
            dto.items.forEach(item => {
                if (item.sortOrder < 0 || item.sortOrder > 999) {
                    throw new Error(
                        `Invalid sort order ${item.sortOrder}. Must be between 0 and 999`,
                    );
                }
            });

            const lineIdToSortOrder = new Map(
                dto.items.map(item => [item.lineId, item.sortOrder]),
            );

            const command = new ReorderJournalTemplateLinesCommand(
                dto.templateId,
                user.organizationId,
                lineIdToSortOrder,
            );

            await this.reorderUseCase.execute(command);

            this.logger.log(
                `[${user.id}] Successfully reordered ${dto.items.length} journal template lines`,
            );

            return {
                success: true,
                message: 'Lines reordered successfully',
                //   reorderedCount: dto.items.length,
            };
        } catch (error) {
            this.logger.error(`[${user.id}] Reorder failed: ${error.message}`);
            throw error;
        }
    }
}