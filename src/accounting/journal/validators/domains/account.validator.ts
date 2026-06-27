import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class AccountValidator {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async validate(accountId: string) {
        const account = await this.prisma.account.findUnique({
            where: {
                id: accountId,
            },
        });

        if (!account) {
            throw new BadRequestException(
                'Account not found.',
            );
        }

        if (account.deletedAt) {
            throw new BadRequestException(
                'Account has been deleted.',
            );
        }

        if (!account.isActive) {
            throw new BadRequestException(
                'Account is inactive.',
            );
        }

        if (!account.isLeaf) {
            throw new BadRequestException(
                'Posting is only allowed to leaf accounts.',
            );
        }

        return account;
    }
}