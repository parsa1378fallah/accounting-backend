import { Injectable } from '@nestjs/common';
import { FiscalYear } from '@prisma/client';

import { FiscalYearNotOpenException } from '../exceptions';

@Injectable()
export class FiscalYearOpenValidator {
    validate(fiscalYear: FiscalYear): FiscalYear {
        if (fiscalYear.isClosed) {
            throw new FiscalYearNotOpenException();
        }

        return fiscalYear;
    }
}