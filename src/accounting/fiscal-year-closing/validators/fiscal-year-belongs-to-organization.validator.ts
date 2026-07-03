import { Injectable } from '@nestjs/common';
import { FiscalYear } from '@prisma/client';

import { FiscalYearCloseValidationException } from '../exceptions';

@Injectable()
export class FiscalYearBelongsToOrganizationValidator {
    validate(
        fiscalYear: FiscalYear,
        organizationId: string,
    ): FiscalYear {
        if (fiscalYear.organizationId !== organizationId) {
            throw new FiscalYearCloseValidationException(
                'Fiscal year does not belong to the current organization.',
            );
        }

        return fiscalYear;
    }
}