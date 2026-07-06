import { Injectable, Logger, Inject } from '@nestjs/common';
import { MissingCostCenterException } from '../../common/exceptions/missing-reference.exception';

export interface CostCenterValidatorInterface {
    exists(costCenterId: string): Promise<boolean>;
    getCostCenter(costCenterId: string): Promise<any>;
}

@Injectable()
export class CostCenterValidatorService {
    private readonly logger = new Logger(CostCenterValidatorService.name);

    constructor(
        @Inject('COST_CENTER_SERVICE')
        private readonly costCenterService: CostCenterValidatorInterface,
    ) { }

    async validateExists(costCenterId: string): Promise<void> {
        if (!costCenterId) {
            return; // اختیاری است
        }

        this.logger.debug(`Validating cost center: ${costCenterId}`);

        try {
            const exists = await this.costCenterService.exists(costCenterId);

            if (!exists) {
                throw new MissingCostCenterException(costCenterId);
            }

            this.logger.debug(`Cost center validation passed: ${costCenterId}`);
        } catch (error) {
            this.logger.error(`Cost center validation failed: ${error.message}`);
            throw error;
        }
    }

    async validate(costCenterId: string): Promise<any> {
        if (!costCenterId) {
            return null;
        }

        await this.validateExists(costCenterId);
        return this.costCenterService.getCostCenter(costCenterId);
    }
}