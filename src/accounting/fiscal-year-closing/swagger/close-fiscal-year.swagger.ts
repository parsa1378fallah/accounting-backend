import { applyDecorators } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiParam,
    ApiBody,
    ApiCreatedResponse,
    ApiBadRequestResponse,
    ApiConflictResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

import { CloseFiscalYearDto } from '../dto';

export function CloseFiscalYearSwagger() {
    return applyDecorators(
        ApiBearerAuth(),

        ApiOperation({
            summary: 'Close fiscal year',
            description:
                'Closes an open fiscal year by generating the closing journal entry and retained earnings record.',
        }),

        ApiParam({
            name: 'fiscalYearId',
            description: 'Fiscal year identifier',
        }),

        ApiBody({
            type: CloseFiscalYearDto,
        }),

        ApiCreatedResponse({
            description: 'Fiscal year closed successfully.',
        }),

        ApiBadRequestResponse({
            description: 'Validation failed.',
        }),

        ApiConflictResponse({
            description:
                'Fiscal year is already closed or validation failed.',
        }),

        ApiForbiddenResponse({
            description:
                'User is not allowed to close fiscal years.',
        }),

        ApiNotFoundResponse({
            description:
                'Fiscal year or retained earnings account not found.',
        }),

        ApiInternalServerErrorResponse({
            description:
                'Closing process failed.',
        }),
    );
}