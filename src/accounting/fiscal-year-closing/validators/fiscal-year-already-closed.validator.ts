import { Injectable } from '@nestjs/common';
import { FiscalYear } from '@prisma/client';

import { FiscalYearAlreadyClosedException } from '../exceptions';

@Injectable()
export class FiscalYearAlreadyClosedValidator {
    validate(fiscalYear: FiscalYear): FiscalYear {
        if (!fiscalYear.isClosed) {
            throw new FiscalYearAlreadyClosedException();
        }

        return fiscalYear;
    }
}