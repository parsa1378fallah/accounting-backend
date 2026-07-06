import { Injectable } from '@nestjs/common';
import { Decimal } from 'decimal.js';
import { JournalTemplateLine } from '../../domain/entities/journal-template-line.entity';
import { AmountType } from '../../domain/value-objects/amount-type.value-object';
import { Formula } from '../../domain/value-objects/formula.value-object';
import { LineAmount } from '../../domain/value-objects/line-amount.value-object';
import { DebitCredit } from '../../domain/value-objects/debit-credit.value-object';
import { SortOrder } from '../../domain/value-objects/sort-order.value-object';
import { TemplateAmountType } from '../../common/enums/template-amount-type.enum';

export interface CreateLineOptions {
    templateId: string;
    accountId: string;
    isDebit?: boolean;
    costCenterId?: string;
    projectId?: string;
    currencyId?: string;
    organizationId: string;
    description?: string;
    sortOrder?: number;
}

@Injectable()
export class JournalTemplateLineFactory {
    createFixedAmountLine(
        options: CreateLineOptions,
        amount: Decimal | number | string,
    ): JournalTemplateLine {
        return JournalTemplateLine.create({
            templateId: options.templateId,
            accountId: options.accountId,
            isDebit: DebitCredit.create(options.isDebit ?? true),
            amountType: AmountType.fixed(),
            amount: LineAmount.create(amount),
            costCenterId: options.costCenterId,
            projectId: options.projectId,
            currencyId: options.currencyId,
            organizationId: options.organizationId,
            description: options.description,
            sortOrder: options.sortOrder
                ? SortOrder.create(options.sortOrder)
                : undefined,
        });
    }

    createPercentageAmountLine(
        options: CreateLineOptions,
        percentage: Decimal | number | string,
    ): JournalTemplateLine {
        return JournalTemplateLine.create({
            templateId: options.templateId,
            accountId: options.accountId,
            isDebit: DebitCredit.create(options.isDebit ?? true),
            amountType: AmountType.percentage(),
            percentage: new Decimal(percentage),
            costCenterId: options.costCenterId,
            projectId: options.projectId,
            currencyId: options.currencyId,
            organizationId: options.organizationId,
            description: options.description,
            sortOrder: options.sortOrder
                ? SortOrder.create(options.sortOrder)
                : undefined,
        });
    }

    createFormulaAmountLine(
        options: CreateLineOptions,
        formula: string,
    ): JournalTemplateLine {
        return JournalTemplateLine.create({
            templateId: options.templateId,
            accountId: options.accountId,
            isDebit: DebitCredit.create(options.isDebit ?? true),
            amountType: AmountType.formula(),
            formula: Formula.create(formula),
            costCenterId: options.costCenterId,
            projectId: options.projectId,
            currencyId: options.currencyId,
            organizationId: options.organizationId,
            description: options.description,
            sortOrder: options.sortOrder
                ? SortOrder.create(options.sortOrder)
                : undefined,
        });
    }
}