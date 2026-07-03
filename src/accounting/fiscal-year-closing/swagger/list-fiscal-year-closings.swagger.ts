import { applyDecorators } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiOkResponse,
} from '@nestjs/swagger';

export function ListFiscalYearClosingsSwagger() {
    return applyDecorators(
        ApiBearerAuth(),

        ApiOperation({
            summary: 'List fiscal year closings',
        }),

        ApiOkResponse({
            description:
                'Fiscal year closings retrieved successfully.',
        }),
    );
}