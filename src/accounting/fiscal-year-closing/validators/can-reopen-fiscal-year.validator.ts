import { Injectable } from '@nestjs/common';
import { FiscalYear } from '@prisma/client';

import { FiscalYearReopenNotAllowedException } from '../exceptions';

@Injectable()
export class CanReopenFiscalYearValidator {
    validate(fiscalYear: FiscalYear): FiscalYear {
        if (!fiscalYear.isClosed) {
            throw new FiscalYearReopenNotAllowedException();
        }

        return fiscalYear;
    }
}