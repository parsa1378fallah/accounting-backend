export const FISCAL_YEAR_ERRORS = {
    NOT_FOUND: 'Fiscal year not found.',

    INVALID_DATE_RANGE:
        'End date must be greater than start date.',

    OVERLAP:
        'Fiscal year overlaps with an existing fiscal year.',

    ALREADY_CLOSED:
        'Fiscal year is already closed.',

    ALREADY_OPEN:
        'Fiscal year is already open.',

    PERIODS_NOT_CLOSED:
        'All fiscal periods must be closed before closing the fiscal year.',

    CLOSED_CANNOT_UPDATE:
        'Closed fiscal year cannot be modified.',

    ORGANIZATION_REQUIRED:
        'Organization is required.',

    CLOSE_FAILED:
        'Unable to close fiscal year.',

    REOPEN_FAILED:
        'Unable to reopen fiscal year.',
    OPEN_PERIOD_EXISTS: 'Unable to close becaude there is open period existed'
} as const;