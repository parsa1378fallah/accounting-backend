import {
    BadRequestException,
    Injectable,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

import { CreateJournalEntryDto } from '../../dto/create-journal-entry.dto';
import { CreateJournalLineDto } from '../../dto/create-journal-line.dto';

@Injectable()
export class JournalLineValidator {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    /**
     * Entry Validation
     */
    async validate(
        dto: CreateJournalEntryDto,
    ): Promise<void> {
        await this.validateLinesExist(dto.lines);

        await this.validateMaximumLines(dto.lines);

        await this.validateSortOrder(dto.lines);

        await this.validateAccounts(dto.organizationId, dto.lines);

        await this.validateCurrencies(dto.lines);

        await this.validateCostCenters(dto.organizationId, dto.lines);

        await this.validateProjects(dto.organizationId, dto.lines);

        await this.validateAmounts(dto.lines);

        await this.validateDuplicateAccounts(dto.lines);

        await this.validateLeafAccounts(dto.lines);

        await this.validateInactiveAccounts(dto.lines);
    }

    /**
     * ----------------------------------------
     * Lines Exist
     * ----------------------------------------
     */

    private async validateLinesExist(
        lines: CreateJournalLineDto[],
    ) {
        if (!lines || lines.length === 0) {
            throw new BadRequestException(
                'Journal entry must contain at least one line.',
            );
        }
    }

    /**
     * ----------------------------------------
     * Maximum Count
     * ----------------------------------------
     */

    private async validateMaximumLines(
        lines: CreateJournalLineDto[],
    ) {
        if (lines.length > 500) {
            throw new BadRequestException(
                'Maximum 500 journal lines are allowed.',
            );
        }
    }

    /**
     * ----------------------------------------
     * Sort Order
     * ----------------------------------------
     */

    private async validateSortOrder(
        lines: CreateJournalLineDto[],
    ) {
        const duplicated = new Set<number>();

        for (const line of lines) {
            if (duplicated.has(Number(line.sortOrder))) {
                throw new BadRequestException(
                    `Duplicate sortOrder (${line.sortOrder}) detected.`,
                );
            }

            duplicated.add(Number(line.sortOrder));
        }
    }

    /**
     * ----------------------------------------
     * Accounts
     * ----------------------------------------
     */

    private async validateAccounts(
        organizationId: string,
        lines: CreateJournalLineDto[],
    ) {
        const ids = [...new Set(lines.map(x => x.accountId))];

        const accounts = await this.prisma.account.findMany({
            where: {
                id: {
                    in: ids,
                },
                organizationId,
                deletedAt: null,
            },
        });

        if (accounts.length !== ids.length) {
            throw new BadRequestException(
                'One or more accounts do not exist.',
            );
        }
    }

    /**
     * ----------------------------------------
     * Leaf Account
     * ----------------------------------------
     */

    private async validateLeafAccounts(
        lines: CreateJournalLineDto[],
    ) {
        const ids = [...new Set(lines.map(x => x.accountId))];

        const accounts = await this.prisma.account.findMany({
            where: {
                id: {
                    in: ids,
                },
            },
            select: {
                id: true,
                isLeaf: true,
            },
        });

        const invalid = accounts.find(
            x => !x.isLeaf,
        );

        if (invalid) {
            throw new BadRequestException(
                `Account (${invalid.id}) is not a leaf account.`,
            );
        }
    }

    /**
     * ----------------------------------------
     * Active Account
     * ----------------------------------------
     */

    private async validateInactiveAccounts(
        lines: CreateJournalLineDto[],
    ) {
        const ids = [...new Set(lines.map(x => x.accountId))];

        const accounts = await this.prisma.account.findMany({
            where: {
                id: {
                    in: ids,
                },
            },
            select: {
                id: true,
                isActive: true,
            },
        });

        const inactive = accounts.find(
            x => !x.isActive,
        );

        if (inactive) {
            throw new BadRequestException(
                `Account (${inactive.id}) is inactive.`,
            );
        }
    }

    /**
     * ----------------------------------------
     * Currency
     * ----------------------------------------
     */

    private async validateCurrencies(
        lines: CreateJournalLineDto[],
    ) {
        const ids = [
            ...new Set(
                lines
                    .filter(x => x.currencyId)
                    .map(x => x.currencyId!),
            ),
        ];

        if (!ids.length) return;

        const currencies = await this.prisma.currency.findMany({
            where: {
                id: {
                    in: ids,
                },
                deletedAt: null,
                isActive: true,
            },
        });

        if (currencies.length !== ids.length) {
            throw new BadRequestException(
                'Invalid currency detected.',
            );
        }
    }

    /**
     * ----------------------------------------
     * Cost Center
     * ----------------------------------------
     */

    private async validateCostCenters(
        organizationId: string,
        lines: CreateJournalLineDto[],
    ) {
        const ids = [
            ...new Set(
                lines
                    .filter(x => x.costCenterId)
                    .map(x => x.costCenterId!),
            ),
        ];

        if (!ids.length) return;

        const result =
            await this.prisma.costCenter.findMany({
                where: {
                    id: {
                        in: ids,
                    },
                    organizationId,
                    deletedAt: null,
                    isActive: true,
                },
            });

        if (result.length !== ids.length) {
            throw new BadRequestException(
                'Invalid cost center detected.',
            );
        }
    }

    /**
     * ----------------------------------------
     * Project
     * ----------------------------------------
     */

    private async validateProjects(
        organizationId: string,
        lines: CreateJournalLineDto[],
    ) {
        const ids = [
            ...new Set(
                lines
                    .filter(x => x.projectId)
                    .map(x => x.projectId!),
            ),
        ];

        if (!ids.length) return;

        const result =
            await this.prisma.project.findMany({
                where: {
                    id: {
                        in: ids,
                    },
                    organizationId,
                    deletedAt: null,
                },
            });

        if (result.length !== ids.length) {
            throw new BadRequestException(
                'Invalid project detected.',
            );
        }
    }

    /**
     * ----------------------------------------
     * Debit/Credit
     * ----------------------------------------
     */

    private async validateAmounts(
        lines: CreateJournalLineDto[],
    ) {
        for (const line of lines) {
            const debit = Number(line.debit);
            const credit = Number(line.credit);

            if (debit < 0 || credit < 0) {
                throw new BadRequestException(
                    'Negative amount is not allowed.',
                );
            }

            if (debit === 0 && credit === 0) {
                throw new BadRequestException(
                    'Debit and Credit cannot both be zero.',
                );
            }

            if (debit > 0 && credit > 0) {
                throw new BadRequestException(
                    'A journal line cannot contain both debit and credit.',
                );
            }
        }
    }

    /**
     * ----------------------------------------
     * Duplicate Accounts
     * ----------------------------------------
     */

    private async validateDuplicateAccounts(
        lines: CreateJournalLineDto[],
    ) {
        const map = new Map<string, number>();

        for (const line of lines) {
            map.set(
                line.accountId,
                (map.get(line.accountId) || 0) + 1,
            );
        }

        for (const [account, count] of map) {
            if (count > 100) {
                throw new BadRequestException(
                    `Account (${account}) repeated too many times.`,
                );
            }
        }
    }
}