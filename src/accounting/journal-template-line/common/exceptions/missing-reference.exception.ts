export class MissingReferenceException extends Error {
    constructor(
        public readonly referenceName: string,
        public readonly referenceId: string,
    ) {
        super(`Missing reference: ${referenceName} with id ${referenceId}`);
    }
}

export class MissingAccountException extends MissingReferenceException {
    constructor(accountId: string) {
        super('Account', accountId);
    }
}

export class MissingCostCenterException extends MissingReferenceException {
    constructor(costCenterId: string) {
        super('CostCenter', costCenterId);
    }
}

export class MissingProjectException extends MissingReferenceException {
    constructor(projectId: string) {
        super('Project', projectId);
    }
}

export class MissingCurrencyException extends MissingReferenceException {
    constructor(currencyId: string) {
        super('Currency', currencyId);
    }
}