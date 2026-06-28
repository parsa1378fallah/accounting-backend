// ============================================================================
// FX Gain/Loss Constants
// ============================================================================

export const FX_GAIN_LOSS = {
    DEFAULT_PAGE: 1,

    DEFAULT_LIMIT: 20,

    MAX_LIMIT: 100,

    DEFAULT_SORT_BY: 'createdAt',

    DEFAULT_SORT_ORDER: 'desc',

    DEFAULT_DECIMAL_PRECISION: 4,
} as const;

export const FX_GAIN_LOSS_EVENTS = {
    CREATED: 'fx-gain-loss.created',

    UPDATED: 'fx-gain-loss.updated',

    DELETED: 'fx-gain-loss.deleted',
} as const;

export const FX_GAIN_LOSS_REFERENCE_TYPES = {
    JOURNAL: 'JOURNAL',

    PAYMENT: 'PAYMENT',

    RECEIPT: 'RECEIPT',

    INVOICE: 'INVOICE',

    PURCHASE: 'PURCHASE',

    SALE: 'SALE',

    MANUAL: 'MANUAL',
} as const;

export const FX_GAIN_LOSS_ERROR_MESSAGES = {
    NOT_FOUND: 'Foreign exchange gain/loss entry not found.',

    DUPLICATE: 'Foreign exchange gain/loss entry already exists.',

    INVALID_EXCHANGE_RATE: 'Invalid exchange rate.',

    INVALID_AMOUNT: 'Invalid amount.',

    INVALID_CURRENCY: 'Invalid currency.',

    INVALID_BASE_CURRENCY: 'Invalid base currency.',

    INVALID_REFERENCE: 'Invalid reference.',

    JOURNAL_REQUIRED: 'Journal entry is required.',
} as const;
export const FX_GAIN_LOSS_CONSTANTS = {
    MODULE_NAME: 'FX_GAIN_LOSS',

    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,

    DEFAULT_SORT_BY: 'createdAt',
    DEFAULT_SORT_ORDER: 'desc',

    DECIMAL_PRECISION: 4,
    EXCHANGE_RATE_PRECISION: 8,

    DESCRIPTION_MAX_LENGTH: 1000,

    REFERENCE_TYPES: [
        'PAYMENT',
        'RECEIPT',
        'JOURNAL',
        'REVALUATION',
        'SETTLEMENT',
        'INVOICE',
        'PURCHASE',
        'SALE',
    ] as const,
} as const