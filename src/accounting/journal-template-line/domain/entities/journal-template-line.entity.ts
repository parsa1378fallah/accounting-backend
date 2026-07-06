import { AggregateRoot } from 'src/common/domain/aggregate-root';
import { Decimal } from 'decimal.js';
import { TemplateLineId } from '../value-objects/template-line-id.value-object';
import { AmountType } from '../value-objects/amount-type.value-object';
import { Formula } from '../value-objects/formula.value-object';
import { LineAmount } from '../value-objects/line-amount.value-object';
import { DebitCredit } from '../value-objects/debit-credit.value-object';
import { SortOrder } from '../value-objects/sort-order.value-object';
import { AccountingReference, AccountingReferenceProps } from '../value-objects/accounting-reference.value-object';
import { CalculationMetadata, CalculationMetadataProps } from '../value-objects/calculation-metadata.value-object';
import { JournalTemplateLineCreatedEvent } from '../events/journal-template-line-created.event';
import { JournalTemplateLineUpdatedEvent } from '../events/journal-template-line-updated.event';
import { JournalTemplateLineDeletedEvent } from '../events/journal-template-line-deleted.event';
import { FormulaChangedEvent } from '../events/formula-changed.event';
import { TemplateLineReorderedEvent } from '../events/template-line-reordered.event';
import { TemplateAmountType } from '../../common/enums/template-amount-type.enum';
import { InvalidAmountTypeException } from '../../common/exceptions/invalid-amount-type.exception';
import { InvalidFormulaException } from '../../common/exceptions/formula-validation.exception';

export interface CreateJournalTemplateLineProps {
    id?: TemplateLineId;
    templateId: string;
    accountId: string;
    isDebit: DebitCredit;
    amountType: AmountType;
    amount?: LineAmount | null;
    percentage?: Decimal | null;
    formula?: Formula | null;
    description?: string;
    sortOrder?: SortOrder;
    costCenterId?: string;
    projectId?: string;
    currencyId?: string;
    organizationId: string;
    metadata?: CalculationMetadata;
}

export class JournalTemplateLine extends AggregateRoot {
    private id: TemplateLineId;
    private templateId: string;
    private accountingRef: AccountingReference;
    private isDebit: DebitCredit;
    private amountType: AmountType;
    private amount: LineAmount | null;
    private percentage: Decimal | null;
    private formula: Formula | null;
    private description: string | null;
    private sortOrder: SortOrder;
    private organizationId: string;
    private metadata: CalculationMetadata;

    private constructor(props: CreateJournalTemplateLineProps) {
        super();
        this.id = props.id || TemplateLineId.create();
        this.templateId = props.templateId;
        this.accountingRef = AccountingReference.create({
            accountId: props.accountId,
            costCenterId: props.costCenterId,
            projectId: props.projectId,
            currencyId: props.currencyId,
        });
        this.isDebit = props.isDebit;
        this.amountType = props.amountType;
        this.amount = props.amount || null;
        this.percentage = props.percentage || null;
        this.formula = props.formula || null;
        this.description = props.description || null;
        this.sortOrder = props.sortOrder || SortOrder.default();
        this.organizationId = props.organizationId;
        this.metadata = props.metadata || CalculationMetadata.create({
            createdAt: new Date(),
            updatedAt: new Date(),
            version: 1,
        });
    }

    static create(props: CreateJournalTemplateLineProps): JournalTemplateLine {
        const line = new JournalTemplateLine(props);

        // بررسی اعتبار
        line.validate();

        // انتشار رویداد
        line.addDomainEvent(
            new JournalTemplateLineCreatedEvent(
                line.id.value,
                line.templateId,
                line.accountingRef.accountId,
                line.organizationId,
            ),
        );

        return line;
    }

    static reconstruct(
        props: CreateJournalTemplateLineProps,
    ): JournalTemplateLine {
        return new JournalTemplateLine(props);
    }

    // Getters
    getId(): TemplateLineId {
        return this.id;
    }

    getTemplateId(): string {
        return this.templateId;
    }

    getAccountId(): string {
        return this.accountingRef.accountId;
    }

    getCostCenterId(): string | undefined {
        return this.accountingRef.costCenterId;
    }

    getProjectId(): string | undefined {
        return this.accountingRef.projectId;
    }

    getCurrencyId(): string | undefined {
        return this.accountingRef.currencyId;
    }

    getOrganizationId(): string {
        return this.organizationId;
    }

    isDebitEntry(): boolean {
        return this.isDebit.isDebit();
    }

    getAmountType(): AmountType {
        return this.amountType;
    }

    getAmount(): LineAmount | null {
        return this.amount;
    }

    getPercentage(): Decimal | null {
        return this.percentage;
    }

    getFormula(): Formula | null {
        return this.formula;
    }

    getDescription(): string | null {
        return this.description;
    }

    getSortOrder(): SortOrder {
        return this.sortOrder;
    }

    getMetadata(): CalculationMetadata {
        return this.metadata;
    }

    // Business Methods
    updateAmount(newAmount: LineAmount): void {
        if (!this.amountType.isFixed()) {
            throw new InvalidAmountTypeException(
                this.amountType.value,
                ['FIXED'],
            );
        }

        const oldAmount = this.amount?.toString();
        this.amount = newAmount;

        this.addDomainEvent(
            new JournalTemplateLineUpdatedEvent(
                this.id.value,
                this.templateId,
                { amount: newAmount.toString(), oldAmount },
            ),
        );
    }

    updatePercentage(newPercentage: Decimal): void {
        if (!this.amountType.isPercentage()) {
            throw new InvalidAmountTypeException(
                this.amountType.value,
                ['PERCENTAGE'],
            );
        }

        const oldPercentage = this.percentage?.toString();
        this.percentage = newPercentage;

        this.addDomainEvent(
            new JournalTemplateLineUpdatedEvent(
                this.id.value,
                this.templateId,
                { percentage: newPercentage.toString(), oldPercentage },
            ),
        );
    }

    updateFormula(newFormula: Formula): void {
        if (!this.amountType.isFormula()) {
            throw new InvalidAmountTypeException(
                this.amountType.value,
                ['FORMULA'],
            );
        }

        const oldFormula = this.formula?.expression;
        this.formula = newFormula;

        this.addDomainEvent(
            new FormulaChangedEvent(
                this.id.value,
                oldFormula || '',
                newFormula.expression,
            ),
        );
    }

    updateDescription(newDescription: string | null): void {
        this.description = newDescription;

        this.addDomainEvent(
            new JournalTemplateLineUpdatedEvent(
                this.id.value,
                this.templateId,
                { description: newDescription },
            ),
        );
    }

    reorderLine(newSortOrder: SortOrder): void {
        const oldSortOrder = this.sortOrder;
        this.sortOrder = newSortOrder;

        this.addDomainEvent(
            new TemplateLineReorderedEvent(
                this.id.value,
                this.templateId,
                oldSortOrder.value,
                newSortOrder.value,
            ),
        );
    }

    delete(): void {
        this.metadata = CalculationMetadata.create({
            ...this.metadata.toJSON(),
            deletedAt: new Date(),
        });

        this.addDomainEvent(
            new JournalTemplateLineDeletedEvent(this.id.value, this.templateId),
        );
    }

    isDeleted(): boolean {
        return this.metadata.isDeleted();
    }

    // Validation
    private validate(): void {
        if (!this.templateId) {
            throw new Error('Template ID is required');
        }

        if (!this.accountingRef.accountId) {
            throw new Error('Account ID is required');
        }

        this.validateAmountConfiguration();
    }

    private validateAmountConfiguration(): void {
        if (this.amountType.isFixed() && !this.amount) {
            throw new InvalidAmountTypeException(
                this.amountType.value,
                ['FIXED requires amount'],
            );
        }

        if (this.amountType.isPercentage() && !this.percentage) {
            throw new InvalidAmountTypeException(
                this.amountType.value,
                ['PERCENTAGE requires percentage'],
            );
        }

        if (this.amountType.isFormula() && !this.formula) {
            throw new InvalidAmountTypeException(
                this.amountType.value,
                ['FORMULA requires formula'],
            );
        }
    }

    // Comparison
    equals(other: JournalTemplateLine): boolean {
        return this.id.equals(other.id);
    }

    // Serialization
    toJSON() {
        return {
            id: this.id.value,
            templateId: this.templateId,
            accountId: this.accountingRef.accountId,
            costCenterId: this.accountingRef.costCenterId,
            projectId: this.accountingRef.projectId,
            currencyId: this.accountingRef.currencyId,
            organizationId: this.organizationId,
            isDebit: this.isDebit.isDebit(),
            amountType: this.amountType.value,
            amount: this.amount?.toString(),
            percentage: this.percentage?.toString(),
            formula: this.formula?.toJSON(),
            description: this.description,
            sortOrder: this.sortOrder.value,
            ...this.metadata.toJSON(),
        };
    }
}