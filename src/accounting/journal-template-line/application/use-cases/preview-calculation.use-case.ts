import { Injectable, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Decimal } from 'decimal.js';
import { CalculationContext } from '../../domain/entities/calculation-context.entity';
import { JournalTemplateLineService } from '../services/journal-template-line.service';
import { AmountCalculatorService } from '../services/amount-calculator.service';
import { CalculationResultMapper } from '../mappers/calculation-result.mapper';
import { CalculationPreviewResponseDto } from '../../presentation/dtos/response/calculation-preview.response.dto';

/**
 * Query برای پیش‌نمایش محاسبات
 */
export class PreviewCalculationQuery {
    constructor(
        public readonly templateId: string,
        public readonly organizationId: string,
        public readonly variables: Record<string, Decimal | number> = {},
        public readonly currencyPrecision: number = 2,
    ) { }
}

/**
 * Use Case برای پیش‌نمایش محاسبات
 */
@Injectable()
@QueryHandler(PreviewCalculationQuery)
export class PreviewCalculationUseCase
    implements IQueryHandler<PreviewCalculationQuery> {
    private readonly logger = new Logger(PreviewCalculationUseCase.name);

    /**
     * ✅ فقط Services لازم
     */
    constructor(
        private readonly templateLineService: JournalTemplateLineService,
        private readonly amountCalculator: AmountCalculatorService,
    ) { }

    async execute(
        query: PreviewCalculationQuery,
    ): Promise<CalculationPreviewResponseDto> {
        this.logger.log(
            `Previewing calculation for template: ${query.templateId}`,
        );

        const startTime = Date.now();

        try {
            // دریافت خطوط
            const lines = await this.templateLineService.findByTemplate(
                query.templateId,
                query.organizationId,
            );

            this.logger.debug(`Found ${lines.length} lines for calculation`);

            // ایجاد context محاسبه
            const context = new CalculationContext(
                query.templateId,
                query.organizationId,
                query.variables,
                undefined,
                query.currencyPrecision,
            );

            // محاسبه مبالغ
            const calculations = await this.amountCalculator.calculateLines(
                lines,
                context,
            );

            // دریافت تعادل
            const balance = this.amountCalculator.getBalance(calculations);

            const executionTime = Date.now() - startTime;

            const preview = {
                results: CalculationResultMapper.fromAmountCalculations(
                    calculations,
                ),
                totalDebit: balance.totalDebit,
                totalCredit: balance.totalCredit,
                isBalanced: balance.isBalanced,
                calculationTime: executionTime,
            };

            this.logger.log(
                `Calculation preview completed - Balanced: ${preview.isBalanced}`,
            );

            return CalculationResultMapper.toPreviewResponse(preview);
        } catch (error) {
            this.logger.error(
                `Failed to preview calculation: ${error.message}`,
            );
            throw error;
        }
    }
}