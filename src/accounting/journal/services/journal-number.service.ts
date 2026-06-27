import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

interface GenerateJournalNumberInput {
    organizationId: string;
    branchId: string;
    fiscalYearId: string;
    referenceType?: string;
}

@Injectable()
export class JournalNumberService {
    constructor(private readonly prisma: PrismaService) { }

    async generate(dto: GenerateJournalNumberInput): Promise<string> {
        return this.prisma.$transaction(async (tx) => {

            const [org, branch, fiscalYear] = await Promise.all([
                tx.organization.findUnique({
                    where: { id: dto.organizationId },
                    select: { code: true },
                }),
                tx.branch.findUnique({
                    where: { id: dto.branchId },
                    select: { code: true },
                }),
                tx.fiscalYear.findUnique({
                    where: { id: dto.fiscalYearId },
                    select: { startAt: true },
                }),
            ]);

            if (!org || !branch || !fiscalYear) {
                throw new Error('Invalid numbering context');
            }

            const year = fiscalYear.startAt.getFullYear();
            const type = dto.referenceType ?? 'GEN';

            const last = await tx.journalEntry.findFirst({
                where: {
                    organizationId: dto.organizationId,
                    branchId: dto.branchId,
                    fiscalYearId: dto.fiscalYearId,
                },
                orderBy: { createdAt: 'desc' },
                select: { entryNumber: true },
            });

            let nextSeq = 1;

            if (last?.entryNumber) {
                const match = last.entryNumber.match(/(\d+)$/);
                if (match) nextSeq = Number(match[1]) + 1;
            }

            const seq = nextSeq.toString().padStart(6, '0');

            return `${org.code}-${branch.code}-${year}-${type}-${seq}`;
        });
    }
}