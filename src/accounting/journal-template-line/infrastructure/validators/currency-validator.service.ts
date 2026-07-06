import { Injectable, Logger, Inject } from '@nestjs/common';
import { MissingCurrencyException } from '../../common/exceptions/missing-reference.exception';

export interface CurrencyValidatorInterface {
    exists(currencyId: string): Promise<boolean>;
    getCurrency(currencyId: string): Promise<any>;
    getPrecision(currencyId: string): Promise<number>;
}

@Injectable()
export class CurrencyValidatorService {
    private readonly logger = new Logger(CurrencyValidatorService.name);

    constructor(
        @Inject('CURRENCY_SERVICE')
        private readonly currencyService: CurrencyValidatorInterface,
    ) { }

    async validateExists(currencyId: string): Promise<void> {
        if (!currencyId) {
            return; // اختیاری است
        }

        this.logger.debug(`Validating currency: ${currencyId}`);

        try {
            const exists = await this.currencyService.exists(currencyId);

            if (!exists) {
                throw new MissingCurrencyException(currencyId);
            }

            this.logger.debug(`Currency validation passed: ${currencyId}`);
        } catch (error) {
            this.logger.error(`Currency validation failed: ${error.message}`);
            throw error;
        }
    }

    async validate(currencyId: string): Promise<any> {
        if (!currencyId) {
            return null;
        }

        await this.validateExists(currencyId);
        return this.currencyService.getCurrency(currencyId);
    }

    async getPrecision(currencyId: string): Promise<number> {
        if (!currencyId) {
            return 2; // پیش‌فرض
        }

        return this.currencyService.getPrecision(currencyId);
    }
}