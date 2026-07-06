import { CalculationResult } from '../../common/types/calculation.types';

export interface CalculationCacheRepository {
    set(
        key: string,
        value: CalculationResult[],
        ttlSeconds?: number,
    ): Promise<void>;

    get(key: string): Promise<CalculationResult[] | null>;

    delete(key: string): Promise<void>;

    clear(pattern: string): Promise<void>;

    exists(key: string): Promise<boolean>;
}