import { Decimal } from '@prisma/client/runtime/library';
import { FiscalYearClosing } from '@prisma/client';

import {
    ClosingPreviewResponseDto,
    FiscalYearClosingListResponseDto,
    FiscalYearClosingResponseDto,
    FiscalYearClosingSummaryResponseDto,
    RetainedEarningsResponseDto,
} from '../dto';

import { DecimalMapper } from './decimal.mapper';

export class FiscalYearClosingMapper {
    static toResponse(
        closing: FiscalYearClosing,
    ): FiscalYearClosingResponseDto {
        return {
            id: closing.id,
            organizationId: closing.organizationId,
            fiscalYearId: closing.fiscalYearId,
            closingJournalEntryId: closing.closingJournalEntryId,
            retainedEarningsAmount: DecimalMapper.toString(
                closing.retainedEarningsAmount,
            ),
            closedById: closing.closedById,
            closedAt: closing.closedAt,
            notes: closing.notes ?? undefined,
            createdAt: closing.createdAt,
        };
    }

    static toList(
        closings: FiscalYearClosing[],
        total: number,
        page: number,
        limit: number,
    ): FiscalYearClosingListResponseDto {
        return {
            items: closings.map((closing) => this.toResponse(closing)),
            total,
            page,
            limit,
        };
    }

    static toRetainedEarnings(
        totalRevenue: Decimal,
        totalExpense: Decimal,
        netIncome: Decimal,
        retainedEarningsAmount: Decimal,
    ): RetainedEarningsResponseDto {
        return {
            totalRevenue: DecimalMapper.toString(totalRevenue),
            totalExpense: DecimalMapper.toString(totalExpense),
            netIncome: DecimalMapper.toString(netIncome),
            retainedEarningsAmount: DecimalMapper.toString(
                retainedEarningsAmount,
            ),
        };
    }

    static toSummary(params: {
        fiscalYearId: string;
        fiscalYearName: string;
        retainedEarningsAmount: Decimal;
        closedAt: Date;
        closedById: string;
        closedByName: string;
        closingJournalEntryId: string;
        closingJournalEntryNumber: string;
        affectedJournalEntries: number;
    }): FiscalYearClosingSummaryResponseDto {
        return {
            fiscalYearId: params.fiscalYearId,

            fiscalYearName: params.fiscalYearName,

            retainedEarningsAmount: DecimalMapper.toString(
                params.retainedEarningsAmount,
            ),

            closedAt: params.closedAt,

            closedById: params.closedById,

            closedByName: params.closedByName,

            closingJournalEntryId: params.closingJournalEntryId,

            closingJournalEntryNumber:
                params.closingJournalEntryNumber,

            affectedJournalEntries:
                params.affectedJournalEntries,
        };
    }

    static toPreview(
        preview: ClosingPreviewResponseDto,
    ): ClosingPreviewResponseDto {
        return {
            fiscalYearId: preview.fiscalYearId,
            totalRevenue: preview.totalRevenue,
            totalExpense: preview.totalExpense,
            netIncome: preview.netIncome,
            retainedEarningsAmount: preview.retainedEarningsAmount,
            draftJournalEntries: preview.draftJournalEntries,
            pendingJournalApprovals:
                preview.pendingJournalApprovals,
            unbalancedJournalEntries:
                preview.unbalancedJournalEntries,
            canClose: preview.canClose,
            warnings: preview.warnings,
        };
    }
}