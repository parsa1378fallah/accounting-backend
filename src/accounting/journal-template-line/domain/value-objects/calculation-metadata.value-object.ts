export interface CalculationMetadataProps {
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
    version: number;
}

export class CalculationMetadata {
    private readonly _createdAt: Date;
    private readonly _updatedAt: Date;
    private readonly _deletedAt?: Date | null;
    private readonly _version: number;

    private constructor(props: CalculationMetadataProps) {
        this._createdAt = props.createdAt;
        this._updatedAt = props.updatedAt;
        this._deletedAt = props.deletedAt;
        this._version = props.version;
    }

    static create(props: CalculationMetadataProps): CalculationMetadata {
        return new CalculationMetadata(props);
    }

    get createdAt(): Date {
        return this._createdAt;
    }

    get updatedAt(): Date {
        return this._updatedAt;
    }

    get deletedAt(): Date | undefined | null {
        return this._deletedAt;
    }

    get version(): number {
        return this._version;
    }

    isDeleted(): boolean {
        return !!this._deletedAt;
    }

    toJSON() {
        return {
            createdAt: this._createdAt,
            updatedAt: this._updatedAt,
            deletedAt: this._deletedAt,
            version: this._version,
        };
    }
}