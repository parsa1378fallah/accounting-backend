import { registerAs } from '@nestjs/config';

export default registerAs('calculation', () => ({
    // Rounding
    rounding: {
        mode: process.env.CALC_ROUNDING_MODE || 'ROUND_HALF_UP',
        precision: parseInt(process.env.CALC_ROUNDING_PRECISION || '2'),
    },

    // Balance Validation
    balanceValidation: {
        enabled: process.env.CALC_BALANCE_CHECK !== 'false',
        tolerance: parseFloat(process.env.CALC_BALANCE_TOLERANCE || '0.01'),
    },

    // Performance
    performance: {
        maxCalculationTime: parseInt(
            process.env.CALC_MAX_TIME || '5000',
        ),
        enableCaching: process.env.CALC_CACHING !== 'false',
        cacheTtl: parseInt(process.env.CALC_CACHE_TTL || '3600'),
    },

    // Logging
    logging: {
        logCalculations: process.env.CALC_LOG !== 'false',
        logErrors: process.env.CALC_LOG_ERRORS !== 'false',
        logPerformance: process.env.CALC_LOG_PERF !== 'false',
    },

    // Limits
    limits: {
        maxLinesPerCalculation: parseInt(
            process.env.CALC_MAX_LINES || '10000',
        ),
        maxVariablesPerCalculation: parseInt(
            process.env.CALC_MAX_VARS || '1000',
        ),
    },
}));