export interface AccountingReferenceProps {
    accountId: string;
    costCenterId?: string;
    projectId?: string;
    currencyId?: string;
}

export class AccountingReference {
    private readonly _accountId: string;
    private readonly _costCenterId?: string;
    private readonly _projectId?: string;
    private readonly _currencyId?: string;

    private constructor(props: AccountingReferenceProps) {
        if (!props.accountId) {
            throw new Error('accountId is required');
        }
        this._accountId = props.accountId;
        this._costCenterId = props.costCenterId;
        this._projectId = props.projectId;
        this._currencyId = props.currencyId;
    }

    static create(props: AccountingReferenceProps): AccountingReference {
        return new AccountingReference(props);
    }

    get accountId(): string {
        return this._accountId;
    }

    get costCenterId(): string | undefined {
        return this._costCenterId;
    }

    get projectId(): string | undefined {
        return this._projectId;
    }

    get currencyId(): string | undefined {
        return this._currencyId;
    }

    hasCostCenter(): boolean {
        return !!this._costCenterId;
    }

    hasProject(): boolean {
        return !!this._projectId;
    }

    hasCurrency(): boolean {
        return !!this._currencyId;
    }

    equals(other: AccountingReference): boolean {
        return (
            this._accountId === other._accountId &&
            this._costCenterId === other._costCenterId &&
            this._projectId === other._projectId &&
            this._currencyId === other._currencyId
        );
    }

    toJSON() {
        return {
            accountId: this._accountId,
            costCenterId: this._costCenterId,
            projectId: this._projectId,
            currencyId: this._currencyId,
        };
    }
}