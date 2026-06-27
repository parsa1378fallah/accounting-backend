// ============================================================================
// providers/prisma-exchange-rate.provider.ts
// پیاده‌سازی ExchangeRateProvider با Prisma + in-memory TTL cache
// Rule ها هرگز Prisma نمی‌بینند — فقط این Provider می‌بیند
// ============================================================================

import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { ExchangeRateProvider } from '../interfaces'

interface CacheEntry {
  value: number | null
  expiresAt: number
}

@Injectable()
export class PrismaExchangeRateProvider implements ExchangeRateProvider {
  private readonly logger = new Logger(PrismaExchangeRateProvider.name)
  private readonly cache  = new Map<string, CacheEntry>()
  private readonly TTL_MS = 60_000 // 60 ثانیه

  constructor(private readonly prisma: PrismaService) {}

  async getRate(currencyCode: string, date: Date = new Date()): Promise<number | null> {
    const cacheKey = `${currencyCode}:${date.toISOString().split('T')[0]}`
    const cached   = this.cache.get(cacheKey)

    if (cached && cached.expiresAt > Date.now()) {
      return cached.value
    }

    try {
      // اسکیمای واقعی: ExchangeRate.currencyId + effectiveDate
      const row = await this.prisma.exchangeRate.findFirst({
        where: {
          currency: { code: currencyCode },
          effectiveDate: { lte: date },
        },
        orderBy: { effectiveDate: 'desc' },
        select: { rate: true },
      })

      const rate = row ? Number(row.rate) : null
      this.cache.set(cacheKey, { value: rate, expiresAt: Date.now() + this.TTL_MS })
      return rate

    } catch (err) {
      this.logger.error(`Failed to fetch exchange rate for ${currencyCode}`, (err as Error).stack)
      return null
    }
  }

  async currencyExists(currencyCode: string): Promise<boolean> {
    const row = await this.prisma.currency.findUnique({
      where: { code: currencyCode },
      select: { id: true },
    })
    return !!row
  }

  /** پاک‌کردن cache — برای تست یا invalidation دستی */
  clearCache(): void {
    this.cache.clear()
  }
}
