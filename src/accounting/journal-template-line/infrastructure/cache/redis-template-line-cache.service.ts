import { Injectable, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { CalculationCacheRepository } from '../../domain/repositories/calculation-cache.repository.interface';
import { CalculationResult } from '../../common/types/calculation.types';
import { JOURNAL_TEMPLATE_LINE_CONSTANTS } from '../../common/constants/journal-template-line.constants';

@Injectable()
export class RedisTemplateCacheService implements CalculationCacheRepository {
    private readonly logger = new Logger(RedisTemplateCacheService.name);

    constructor(
        @InjectRedis()
        private readonly redis: Redis,
    ) { }

    async set(
        key: string,
        value: CalculationResult[],
        ttlSeconds: number = JOURNAL_TEMPLATE_LINE_CONSTANTS.CACHE_TTL_SECONDS,
    ): Promise<void> {
        try {
            this.logger.debug(`Setting cache: ${key} (TTL: ${ttlSeconds}s)`);

            const serialized = JSON.stringify(value);
            await this.redis.setex(key, ttlSeconds, serialized);
        } catch (error) {
            this.logger.warn(`Failed to set cache: ${error.message}`);
            throw error;
        }
    }

    async get(key: string): Promise<CalculationResult[] | null> {
        try {
            const cached = await this.redis.get(key);

            if (!cached) {
                return null;
            }

            this.logger.debug(`Cache hit: ${key}`);
            return JSON.parse(cached);
        } catch (error) {
            this.logger.warn(`Failed to get cache: ${error.message}`);
            return null;
        }
    }

    async delete(key: string): Promise<void> {
        try {
            await this.redis.del(key);
            this.logger.debug(`Cache deleted: ${key}`);
        } catch (error) {
            this.logger.warn(`Failed to delete cache: ${error.message}`);
            throw error;
        }
    }

    async clear(pattern: string): Promise<void> {
        try {
            const keys = await this.redis.keys(pattern);

            if (keys.length > 0) {
                await this.redis.del(...keys);
            }

            this.logger.debug(`Cache cleared with pattern: ${pattern}`);
        } catch (error) {
            this.logger.warn(`Failed to clear cache: ${error.message}`);
            throw error;
        }
    }

    async exists(key: string): Promise<boolean> {
        try {
            const result = await this.redis.exists(key);
            return result === 1;
        } catch (error) {
            this.logger.warn(`Failed to check cache existence: ${error.message}`);
            return false;
        }
    }
}