import { applyDecorators } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiParam,
    ApiOkResponse,
    ApiNotFoundResponse,
} from '@nestjs/swagger';

export function GetFiscalYearClosingSwagger() {
    return applyDecorators(
        ApiBearerAuth(),

        ApiOperation({
            summary: 'Get fiscal year closing',
        }),

        ApiParam({
            name: 'id',
        }),

        ApiOkResponse({
            description:
                'Fiscal year closing retrieved successfully.',
        }),

        ApiNotFoundResponse({
            description:
                'Closing record not found.',
        }),
    );
}