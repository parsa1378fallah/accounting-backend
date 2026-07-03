import { applyDecorators } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiParam,
    ApiOkResponse,
    ApiNotFoundResponse,
    ApiForbiddenResponse,
} from '@nestjs/swagger';

export function PreviewFiscalYearClosingSwagger() {
    return applyDecorators(
        ApiBearerAuth(),

        ApiOperation({
            summary: 'Preview fiscal year closing',
            description:
                'Returns the calculated closing journal before executing the closing process.',
        }),

        ApiParam({
            name: 'fiscalYearId',
        }),

        ApiOkResponse({
            description:
                'Closing preview generated successfully.',
        }),

        ApiForbiddenResponse({
            description:
                'Access denied.',
        }),

        ApiNotFoundResponse({
            description:
                'Fiscal year not found.',
        }),
    );
}