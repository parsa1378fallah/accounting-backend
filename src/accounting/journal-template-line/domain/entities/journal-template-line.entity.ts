import { TemplateAmountType } from '../enums/template-amount-type.enum';

export interface JournalTemplateLineProps {
    organizationId: string;

    templateId: string;

    accountId: string;

    isDebit: boolean;

    amountType: TemplateAmountType;

    amount?: number | null;

    percentage?: number | null;

    formula?: Record<string, unknown> | null;

    description?: string | null;

    sortOrder: number;

    costCenterId?: string | null;

    projectId?: string | null;

    currencyId?: string | null;
}


export class JournalTemplateLineEntity {

    private readonly id: string;

    private props: JournalTemplateLineProps;


    constructor(
        id: string,
        props: JournalTemplateLineProps,
    ) {
        this.validate(props);

        this.id = id;
        this.props = props;
    }


    getId(): string {
        return this.id;
    }


    getProps(): JournalTemplateLineProps {
        return {
            ...this.props,
        };
    }


    updateAmountType(
        amountType: TemplateAmountType,
    ): void {

        this.props.amountType = amountType;

        this.validate(this.props);
    }


    updateSortOrder(
        sortOrder: number,
    ): void {

        if (sortOrder < 0) {
            throw new Error(
                'Sort order cannot be negative',
            );
        }

        this.props.sortOrder = sortOrder;
    }


    softDelete(): void {
        // بعداً deletedAt را اضافه می‌کنیم
    }


    private validate(
        props: JournalTemplateLineProps,
    ): void {

        if (!props.organizationId) {
            throw new Error(
                'Organization is required',
            );
        }


        if (!props.templateId) {
            throw new Error(
                'Template is required',
            );
        }


        if (!props.accountId) {
            throw new Error(
                'Account is required',
            );
        }


        if (props.sortOrder < 0) {
            throw new Error(
                'Invalid sort order',
            );
        }

    }
}