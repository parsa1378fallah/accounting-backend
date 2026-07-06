import { registerAs } from '@nestjs/config';

export default registerAs('journal-template-line', () => ({
    // Cache
    cache: {
        ttlSeconds: parseInt(process.env.JTL_CACHE_TTL || '3600'),
        enabled: process.env.JTL_CACHE_ENABLED !== 'false',
    },

    // Batch Processing
    batch: {
        size: parseInt(process.env.JTL_BATCH_SIZE || '100'),
        maxConcurrency: parseInt(process.env.JTL_MAX_CONCURRENCY || '5'),
    },

    // Amount Limits
    limits: {
        minAmount: parseFloat(process.env.JTL_MIN_AMOUNT || '0.01'),
        maxAmount: parseFloat(process.env.JTL_MAX_AMOUNT || '999999999.9999'),
        minPercentage: parseFloat(process.env.JTL_MIN_PERCENTAGE || '0'),
        maxPercentage: parseFloat(process.env.JTL_MAX_PERCENTAGE || '100'),
        maxDescriptionLength: parseInt(
            process.env.JTL_MAX_DESCRIPTION || '500',
        ),
        maxSortOrder: parseInt(process.env.JTL_MAX_SORT_ORDER || '999'),
    },

    // Features
    features: {
        enableFormulas: process.env.JTL_ENABLE_FORMULAS !== 'false',
        enableBulkOperations: process.env.JTL_ENABLE_BULK !== 'false',
        enableCalculationPreview: process.env.JTL_ENABLE_PREVIEW !== 'false',
        enableEventPublishing: process.env.JTL_ENABLE_EVENTS !== 'false',
    },

    // Validation
    validation: {
        strictMode: process.env.JTL_STRICT_VALIDATION === 'true',
        validateReferences: process.env.JTL_VALIDATE_REFS !== 'false',
    },
}));