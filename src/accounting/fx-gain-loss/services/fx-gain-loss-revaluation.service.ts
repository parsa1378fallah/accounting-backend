import {
    Injectable,
    Logger,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

import { FxGainLossUnrealizedService } from './fx-gain-loss-unrealized.service';

import { FxGainLossEntry } from '@prisma/client';
import { FxOpenBalance } from '../interfaces/fx-open-balance.interface';

@Injectable()
export class FxGainLossRevaluationService {
    private readonly logger = new Logger(
        FxGainLossRevaluationService.name,
    );

    constructor(
        private readonly prisma: PrismaService,

        private readonly unrealizedService: FxGainLossUnrealizedService,
    ) { }

    /**
     * Execute Period End Revaluation
     */
    async execute(
        organizationId: string,
        baseCurrencyId: string,
    ) {
        //--------------------------------------------------
        // Load Open Foreign Currency Balances
        //--------------------------------------------------

        const balances = await this.loadOpenBalances(
            organizationId,
            baseCurrencyId,
        );

        const results: FxGainLossEntry[] = [];

        //--------------------------------------------------
        // Process each balance
        //--------------------------------------------------

        for (const balance of balances) {
            const currentRate = await this.loadCurrentRate(
                balance.currencyId,
            );

            if (!currentRate) {
                this.logger.warn(
                    `Exchange rate not found for currency ${balance.currencyId}`,
                );

                continue;
            }

            const entry =
                await this.unrealizedService.createRevaluation({
                    organizationId,

                    journalEntryId:
                        balance.journalEntryId,

                    currencyId:
                        balance.currencyId,

                    baseCurrencyId,

                    foreignAmount:
                        balance.foreignAmount,

                    bookRate:
                        balance.bookRate,

                    currentRate,

                    referenceType:
                        'REVALUATION',

                    referenceId:
                        balance.journalEntryId,

                    description:
                        'Period End FX Revaluation',
                });

            results.push(entry);
        }

        return {
            totalProcessed: balances.length,
            totalCreated: results.length,
            entries: results,
        };
    }

    //--------------------------------------------------
    // Load Open Balances
    //--------------------------------------------------

    private async loadOpenBalances(
        organizationId: string,
        baseCurrencyId: string,
    ): Promise<FxOpenBalance[]> {
        /**
         * TODO
         *
         * در آینده این متد مانده‌های باز ارزی را از:
         *
         * - Journal Entries
         * - Accounts Receivable
         * - Accounts Payable
         * - Bank Accounts
         * - Cash Accounts
         *
         * استخراج و تجمیع خواهد کرد.
         */

        const balances: FxOpenBalance[] = [];

        return balances;
    }

    //--------------------------------------------------
    // Load Latest Exchange Rate
    //--------------------------------------------------

    private async loadCurrentRate(
        currencyId: string,
    ): Promise<number | null> {
        const rate =
            await this.prisma.exchangeRate.findFirst({
                where: {
                    currencyId,
                    isActive: true,
                },
                orderBy: {
                    effectiveDate: 'desc',
                },
                select: {
                    rate: true,
                },
            });

        if (!rate) {
            return null;
        }

        return Number(rate.rate);
    }
}