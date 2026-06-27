import { Prisma } from '@prisma/client';
import { CreateJournalEntryDto } from '../dto/create-journal-entry.dto';
import { CreateJournalLineDto } from '../dto/create-journal-line.dto';

export class JournalMapper {
    static calculateTotals(lines: CreateJournalLineDto[]) {
        const totalDebit = lines.reduce(
            (sum, l) => sum + Number(l.debit),
            0,
        );

        const totalCredit = lines.reduce(
            (sum, l) => sum + Number(l.credit),
            0,
        );

        return { totalDebit, totalCredit };
    }

    static toLinesInput(
        lines: CreateJournalLineDto[],
        journalEntryId: string,
        baseCurrency: string,
    ): Prisma.JournalEntryLineCreateManyInput[] {
        return lines.map((l, index) => ({
            journalEntryId,

            accountId: l.accountId,
            costCenterId: l.costCenterId ?? null,
            projectId: l.projectId ?? null,

            description: l.description ?? null,

            debit: l.debit,
            credit: l.credit,

            currencyId: l.currencyId ?? baseCurrency,

            sortOrder: index,
        }));
    }

    static toJournalCreateInput(
        dto: CreateJournalEntryDto,
        entryNumber: string,
    ): Prisma.JournalEntryCreateInput {
        const totals = this.calculateTotals(dto.lines);

        return {
            entryNumber,
            description: dto.description ?? null,
            referenceType: dto.referenceType ?? null,
            referenceId: dto.referenceId ?? null,
            status: 'DRAFT',

            totalDebit: totals.totalDebit,
            totalCredit: totals.totalCredit,

            organization: {
                connect: { id: dto.organizationId },
            },
            fiscalYear: {
                connect: { id: dto.fiscalYearId },
            },
            branch: {
                connect: { id: dto.branchId },
            },
        };
    }
}