export class InvalidAmountTypeException extends Error {
    constructor(
        public readonly amountType: string,
        public readonly allowedTypes: string[] = ['FIXED', 'PERCENTAGE', 'FORMULA'],
    ) {
        super(
            `Invalid amount type: ${amountType}. Allowed: ${allowedTypes.join(', ')}`,
        );
    }
}