import { Decimal } from 'decimal.js';
import { JournalTemplateLine } from '../../domain/entities/journal-template-line.entity';
import { AmountType } from '../../domain/value-objects/amount-type.value-object';
import { Formula } from '../../domain/value-objects/formula.value-object';
import { LineAmount } from '../../domain/value-objects/line-amount.value-object';
import { DebitCredit } from '../../domain/value-objects/debit-credit.value-object';
import { SortOrder } from '../../domain/value-objects/sort-order.value-object';

export class TemplateLineBuilder {
    private templateId: string = '';
    private accountId: string = '';
    private isDebit: boolean = true;
    private amountType: AmountType = AmountType.fixed();
    private amount: LineAmount | null = null;
    private percentage: Decimal | null = null;
    private formula: Formula | null = null;
    private description: string | null = null;
    private sortOrder: number = 0;
    private costCenterId: string | undefined;
    private projectId: string | undefined;
    private currencyId: string | undefined;
    private organizationId: string = '';

    setTemplate(templateId: string): this {
        this.templateId = templateId;
        return this;
    }

    setAccount(accountId: string): this {
        this.accountId = accountId;
        return this;
    }

    setDebit(isDebit: boolean): this {
        this.isDebit = isDebit;
        return this;
    }

    setAsFixedAmount(amount: Decimal | number | string): this {
        this.amountType = AmountType.fixed();
        this.amount = LineAmount.create(amount);
        this.percentage = null;
        this.formula = null;
        return this;
    }

    setAsPercentage(percentage: Decimal | number | string): this {
        this.amountType = AmountType.percentage();
        this.percentage = new Decimal(percentage);
        this.amount = null;
        this.formula = null;
        return this;
    }

    setAsFormula(formula: string): this {
        this.amountType = AmountType.formula();
        this.formula = Formula.create(formula);
        this.amount = null;
        this.percentage = null;
        return this;
    }

    setDescription(description: string | null): this {
        this.description = description;
        return this;
    }

    setSortOrder(sortOrder: number): this {
        this.sortOrder = sortOrder;
        return this;
    }

    setCostCenter(costCenterId: string | undefined): this {
        this.costCenterId = costCenterId;
        return this;
    }

    setProject(projectId: string | undefined): this {
        this.projectId = projectId;
        return this;
    }

    setCurrency(currencyId: string | undefined): this {
        this.currencyId = currencyId;
        return this;
    }

    setOrganization(organizationId: string): this {
        this.organizationId = organizationId;
        return this;
    }

    build(): JournalTemplateLine {
        if (!this.templateId) {
            throw new Error('Template ID is required');
        }

        if (!this.accountId) {
            throw new Error('Account ID is required');
        }

        if (!this.organizationId) {
            throw new Error('Organization ID is required');
        }

        return JournalTemplateLine.create({
            templateId: this.templateId,
            accountId: this.accountId,
            isDebit: DebitCredit.create(this.isDebit),
            amountType: this.amountType,
            amount: this.amount,
            percentage: this.percentage,
            formula: this.formula,
            description: this.description ?? undefined,
            sortOrder: SortOrder.create(this.sortOrder),
            costCenterId: this.costCenterId,
            projectId: this.projectId,
            currencyId: this.currencyId,
            organizationId: this.organizationId,
        });
    }
}