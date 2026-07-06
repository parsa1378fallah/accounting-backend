import { Injectable, Logger } from '@nestjs/common';
import { CalculationResult } from '../../common/types/calculation.types';
import { JOURNAL_TEMPLATE_LINE_CONSTANTS } from '../../common/constants/journal-template-line.constants';

@Injectable()
export class TemplateCacheService {
    private readonly logger = new Logger(TemplateCacheService.name);
    private cache = new Map<string, { data: any; expiresAt: number }>();

    set(
        key: string,
        value: any,
        ttlSeconds: number = JOURNAL_TEMPLATE_LINE_CONSTANTS.CACHE_TTL_SECONDS,
    ): void {
        this.logger.debug(`Caching key: ${key} (TTL: ${ttlSeconds}s)`);

        const expiresAt = Date.now() + ttlSeconds * 1000;
        this.cache.set(key, { data: value, expiresAt });
    }

    get(key: string): any | null {
        const cached = this.cache.get(key);

        if (!cached) {
            return null;
        }

        if (Date.now() > cached.expiresAt) {
            this.cache.delete(key);
            return null;
        }

        this.logger.debug(`Cache hit: ${key}`);
        return cached.data;
    }

    delete(key: string): void {
        this.cache.delete(key);
        this.logger.debug(`Cache deleted: ${key}`);
    }

    clear(pattern?: string): void {
        if (!pattern) {
            this.cache.clear();
            this.logger.debug('Cache cleared');
            return;
        }

        const regex = new RegExp(pattern);
        for (const key of this.cache.keys()) {
            if (regex.test(key)) {
                this.cache.delete(key);
            }
        }

        this.logger.debug(`Cache cleared with pattern: ${pattern}`);
    }

    exists(key: string): boolean {
        const cached = this.cache.get(key);

        if (!cached) {
            return false;
        }

        if (Date.now() > cached.expiresAt) {
            this.cache.delete(key);
            return false;
        }

        return true;
    }

    getStats() {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys()),
        };
    }
}