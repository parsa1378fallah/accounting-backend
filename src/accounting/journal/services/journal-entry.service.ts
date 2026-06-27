import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JournalBalanceValidator } from '../validators/domains/journal-balance.validator';
import { JournalNumberService } from './journal-number.service';
import { JournalMapper } from '../mappers/journal.mapper';
import { CreateJournalEntryDto } from '../dto/create-journal-entry.dto';
import { JournalEntryLine } from '@prisma/client';

@Injectable()
export class JournalEntryService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly validator: JournalBalanceValidator,
        private readonly numberService: JournalNumberService,
    ) { }

    async createJournalEntry(dto: CreateJournalEntryDto) {
        return this.prisma.$transaction(async (tx) => {

            // 1. Generate entry number
            const entryNumber = await this.numberService.generate({
                organizationId: dto.organizationId,
                branchId: dto.branchId,
                fiscalYearId: dto.fiscalYearId,
                referenceType: dto.referenceType,
            });

            // 2. Map DTO → Domain lines (IMPORTANT FIX)
            const domainLines: JournalEntryLine[] = dto.lines.map((l, index) => ({
                id: `temp-${index}`, // فقط برای validation لازم است
                journalEntryId: '',  // هنوز ساخته نشده
                accountId: l.accountId,
                costCenterId: l.costCenterId ?? null,
                projectId: l.projectId ?? null,
                description: l.description ?? null,

                debit: l.debit as any,
                credit: l.credit as any,

                currency: l.currencyId ?? 'IRR',
                foreignDebit: l.foreignDebit ?? null,
                foreignCredit: l.foreignCredit ?? null,
                exchangeRateSnapshot: l.exchangeRateSnapshot ?? null,

                sortOrder: l.sortOrder ?? index,

                createdAt: new Date(),
                updatedAt: new Date(),
            })) as unknown as JournalEntryLine[];

            // 3. VALIDATION (BEFORE DB)
            const validation = this.validator.run(domainLines, {
                multiCurrency: true,
                baseCurrency: 'IRR',
            });

            if (!validation.valid) {
                throw new BadRequestException({
                    message: 'Journal entry validation failed',
                    ...validation,
                });
            }

            // 4. CREATE JOURNAL HEADER
            const journal = await tx.journalEntry.create({
                data: JournalMapper.toJournalCreateInput(dto, entryNumber),
            });

            // 5. CREATE LINES
            await tx.journalEntryLine.createMany({
                data: dto.lines.map((l, index) => ({
                    journalEntryId: journal.id,
                    accountId: l.accountId,
                    costCenterId: l.costCenterId ?? null,
                    projectId: l.projectId ?? null,
                    description: l.description ?? null,

                    debit: l.debit,
                    credit: l.credit,

                    currency: l.currencyId ?? 'IRR',
                    foreignDebit: l.foreignDebit ?? null,
                    foreignCredit: l.foreignCredit ?? null,
                    exchangeRateSnapshot: l.exchangeRateSnapshot ?? null,

                    sortOrder: l.sortOrder ?? index,
                })),
            });

            return {
                ...journal,
                validation,
            };
        });
    }

    async getJournalEntry(id: string) {
        return this.prisma.journalEntry.findUnique({
            where: { id },
            include: { lines: true },
        });
    }

    async deleteDraftJournal(id: string) {
        return this.prisma.$transaction(async (tx) => {
            const journal = await tx.journalEntry.findUnique({
                where: { id },
            });

            if (!journal) {
                throw new BadRequestException('Journal not found');
            }

            if (journal.status !== 'DRAFT') {
                throw new BadRequestException('Only DRAFT journals can be deleted');
            }

            await tx.journalEntryLine.deleteMany({
                where: { journalEntryId: id },
            });

            await tx.journalEntry.delete({
                where: { id },
            });

            return true;
        });
    }
}