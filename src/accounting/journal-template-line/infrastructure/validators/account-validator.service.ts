import { Injectable, Logger, Inject } from '@nestjs/common';
import { MissingAccountException } from '../../common/exceptions/missing-reference.exception';

export interface AccountValidatorInterface {
    exists(accountId: string): Promise<boolean>;
    getAccount(accountId: string): Promise<any>;
}

@Injectable()
export class AccountValidatorService {
    private readonly logger = new Logger(AccountValidatorService.name);

    constructor(
        @Inject('ACCOUNT_SERVICE')
        private readonly accountService: AccountValidatorInterface,
    ) { }

    async validateExists(accountId: string): Promise<void> {
        this.logger.debug(`Validating account: ${accountId}`);

        try {
            const exists = await this.accountService.exists(accountId);

            if (!exists) {
                throw new MissingAccountException(accountId);
            }

            this.logger.debug(`Account validation passed: ${accountId}`);
        } catch (error) {
            this.logger.error(`Account validation failed: ${error.message}`);
            throw error;
        }
    }

    async validate(accountId: string): Promise<any> {
        await this.validateExists(accountId);
        return this.accountService.getAccount(accountId);
    }
}