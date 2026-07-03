import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FiscalYearCloseValidationException } from '../exceptions';

@Injectable()
export class RetainedEarningsAccountExistsValidator {
    constructor(private readonly prisma: PrismaService) { }

    async validate(organizationId: string): Promise<void> {
        const account = await this.prisma.account.findFirst({
            where: {
                organizationId,
                code: 'RETAINED_EARNINGS',
                isActive: true,
            },
        });

        if (!account) {
            throw new FiscalYearCloseValidationException(
                'Retained earnings account not configured.',
            );
        }
    }
}