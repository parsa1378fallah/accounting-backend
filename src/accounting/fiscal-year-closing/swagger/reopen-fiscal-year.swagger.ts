import { applyDecorators } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiParam,
    ApiBody,
    ApiOkResponse,
    ApiBadRequestResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiConflictResponse,
    ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

import {
    ReopenFiscalYearDto,
    FiscalYearClosingResponseDto,
} from '../dto';

export function ReopenFiscalYearSwagger() {
    return applyDecorators(
        ApiBearerAuth(),

        ApiOperation({
            summary: 'Reopen a closed fiscal year',
            description:
                'Reopens a previously closed fiscal year by reversing the closing process and unlocking the fiscal year.',
        }),

        ApiParam({
            name: 'fiscalYearId',
            type: String,
            required: true,
            description: 'Fiscal year identifier.',
            example: 'cmcq1pkz60000l6m4mqn8tq8w',
        }),

        ApiBody({
            type: ReopenFiscalYearDto,
        }),

        ApiOkResponse({
            description: 'Fiscal year reopened successfully.',
            type: FiscalYearClosingResponseDto,
        }),

        ApiBadRequestResponse({
            description:
                'The reopen request is invalid or the fiscal year cannot be reopened.',
        }),

        ApiForbiddenResponse({
            description:
                'You do not have permission to reopen fiscal years.',
        }),

        ApiNotFoundResponse({
            description:
                'Fiscal year or fiscal year closing record was not found.',
        }),

        ApiConflictResponse({
            description:
                'The fiscal year is already open or cannot be reopened because of dependent transactions.',
        }),

        ApiInternalServerErrorResponse({
            description:
                'An unexpected error occurred while reopening the fiscal year.',
        }),
    );
}