import { Injectable, Logger } from '@nestjs/common';
import type { CalculationCacheRepository } from '../../domain/repositories/calculation-cache.repository.interface';
import { CalculationResult } from '../../common/types/calculation.types';
import { JOURNAL_TEMPLATE_LINE_CONSTANTS } from '../../common/constants/journal-template-line.constants';

@Injectable()
export class JournalTemplateLineCacheService {
    private readonly logger = new Logger(JournalTemplateLineCacheService.name);

    constructor(
        private readonly cacheRepository: CalculationCacheRepository,
    ) { }

    async getCachedCalculations(
        templateId: string,
        organizationId: string,
    ): Promise<CalculationResult[] | null> {
        const key = this.buildKey(templateId, organizationId);

        try {
            const cached = await this.cacheRepository.get(key);
            if (cached) {
                this.logger.debug(`Cache hit for key: ${key}`);
            }
            return cached;
        } catch (error) {
            this.logger.warn(`Cache retrieval failed: ${error.message}`);
            return null;
        }
    }

    async setCachedCalculations(
        templateId: string,
        organizationId: string,
        results: CalculationResult[],
    ): Promise<void> {
        const key = this.buildKey(templateId, organizationId);

        try {
            await this.cacheRepository.set(
                key,
                results,
                JOURNAL_TEMPLATE_LINE_CONSTANTS.CACHE_TTL_SECONDS,
            );
            this.logger.debug(`Cache set for key: ${key}`);
        } catch (error) {
            this.logger.warn(`Cache set failed: ${error.message}`);
        }
    }

    async invalidateCache(templateId: string): Promise<void> {
        const pattern = `*:${templateId}:*`;

        try {
            await this.cacheRepository.clear(pattern);
            this.logger.debug(`Cache invalidated for pattern: ${pattern}`);
        } catch (error) {
            this.logger.warn(`Cache invalidation failed: ${error.message}`);
        }
    }

    private buildKey(templateId: string, organizationId: string): string {
        return `calc:${templateId}:${organizationId}`;
    }
}