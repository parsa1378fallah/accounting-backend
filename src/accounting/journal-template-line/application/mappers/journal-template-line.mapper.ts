import { Decimal } from 'decimal.js';

import { JournalTemplateLine } from '../../domain/entities/journal-template-line.entity';

import { TemplateLineId } from '../../domain/value-objects/template-line-id.value-object';
import { AmountType } from '../../domain/value-objects/amount-type.value-object';
import { Formula } from '../../domain/value-objects/formula.value-object';
import { LineAmount } from '../../domain/value-objects/line-amount.value-object';
import { DebitCredit } from '../../domain/value-objects/debit-credit.value-object';
import { SortOrder } from '../../domain/value-objects/sort-order.value-object';
import { CalculationMetadata } from '../../domain/value-objects/calculation-metadata.value-object';

import { JournalTemplateLineResponseDto } from '../../presentation/dtos/response/journal-template-line.response.dto';

export class JournalTemplateLineMapper {
    static toDomain(raw: any): JournalTemplateLine {
        return JournalTemplateLine.reconstruct({
            id: TemplateLineId.of(raw.id),
            templateId: raw.templateId,
            accountId: raw.accountId,
            isDebit: DebitCredit.create(raw.isDebit),
            amountType: AmountType.create(raw.amountType),
            amount: raw.amount != null ? LineAmount.create(raw.amount) : null,
            percentage:
                raw.percentage != null
                    ? new Decimal(raw.percentage)
                    : null,
            formula:
                raw.formula != null
                    ? Formula.create(raw.formula.expression)
                    : null,
            description: raw.description,
            sortOrder: SortOrder.create(raw.sortOrder),
            costCenterId: raw.costCenterId,
            projectId: raw.projectId,
            currencyId: raw.currencyId,
            organizationId: raw.organizationId,
            metadata: CalculationMetadata.create({
                createdAt: raw.createdAt,
                updatedAt: raw.updatedAt,
                deletedAt: raw.deletedAt,
                version: raw.version ?? 1,
            }),
        });
    }

    static toResponse(
        line: JournalTemplateLine,
    ): JournalTemplateLineResponseDto {
        return {
            id: line.getId().value,
            templateId: line.getTemplateId(),

            accountId: line.getAccountId(),

            costCenterId: line.getCostCenterId(),

            projectId: line.getProjectId(),

            currencyId: line.getCurrencyId(),

            organizationId: line.getOrganizationId(),

            isDebit: line.isDebitEntry(),

            amountType: line.getAmountType().value,

            amount: line.getAmount()
                ? Number(line.getAmount()!.value.toString())
                : undefined,

            percentage: line.getPercentage()?.toString(),

            formula: line.getFormula()?.toJSON(),

            description: line.getDescription() ?? undefined,

            sortOrder: line.getSortOrder().value,

            createdAt: line.getMetadata().createdAt,

            updatedAt: line.getMetadata().updatedAt,

            deletedAt: line.getMetadata().deletedAt ?? undefined,

            version: line.getMetadata().version,
        };
    }

    static toResponses(
        lines: JournalTemplateLine[],
    ): JournalTemplateLineResponseDto[] {
        return lines.map(line => this.toResponse(line));
    }

    static toPersistence(line: JournalTemplateLine): any {
        return line.toJSON();
    }
}