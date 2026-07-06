import { Injectable, Logger } from '@nestjs/common';
import { TemplateCacheService } from '../../cache/template-line-cache.service';
import { CalculationCacheRepository } from '../../../domain/repositories/calculation-cache.repository.interface';
import { CalculationResult } from '../../../common/types/calculation.types';

@Injectable()
export class CalculationCacheRepositoryImpl implements CalculationCacheRepository {
    private readonly logger = new Logger(CalculationCacheRepositoryImpl.name);

    constructor(
        private readonly cacheService: TemplateCacheService,
    ) { }

    async set(
        key: string,
        value: CalculationResult[],
        ttlSeconds?: number,
    ): Promise<void> {
        try {
            this.cacheService.set(key, value, ttlSeconds);
        } catch (error) {
            this.logger.error(`Failed to set calculation cache: ${error.message}`);
            throw error;
        }
    }

    async get(key: string): Promise<CalculationResult[] | null> {
        try {
            return this.cacheService.get(key);
        } catch (error) {
            this.logger.error(`Failed to get calculation cache: ${error.message}`);
            return null;
        }
    }

    async delete(key: string): Promise<void> {
        try {
            this.cacheService.delete(key);
        } catch (error) {
            this.logger.error(`Failed to delete calculation cache: ${error.message}`);
            throw error;
        }
    }

    async clear(pattern: string): Promise<void> {
        try {
            this.cacheService.clear(pattern);
        } catch (error) {
            this.logger.error(`Failed to clear calculation cache: ${error.message}`);
            throw error;
        }
    }

    async exists(key: string): Promise<boolean> {
        try {
            return this.cacheService.exists(key);
        } catch (error) {
            this.logger.error(`Failed to check calculation cache existence: ${error.message}`);
            return false;
        }
    }
}