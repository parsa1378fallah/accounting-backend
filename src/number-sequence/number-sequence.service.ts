import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NumberSequenceService {
    constructor(private prisma: PrismaService) { }

    // ساخت sequence برای یک entity
    async createSequence(organizationId: string, entity: string, prefix: string, padding = 6) {
        const existing = await this.prisma.numberSequence.findUnique({
            where: {
                organizationId_entity: {
                    organizationId,
                    entity,
                },
            },
        });

        if (existing) {
            throw new BadRequestException('Sequence already exists');
        }

        return this.prisma.numberSequence.create({
            data: {
                organizationId,
                entity,
                prefix,
                currentNumber: 0,
                padding,
            },
        });
    }

    // گرفتن شماره بعدی (مهم‌ترین بخش)
    async getNextNumber(organizationId: string, entity: string) {
        return this.prisma.$transaction(async (tx) => {
            const sequence = await tx.numberSequence.findUnique({
                where: {
                    organizationId_entity: {
                        organizationId,
                        entity,
                    },
                },
            });

            if (!sequence) {
                throw new BadRequestException('Sequence not found');
            }

            const nextNumber = sequence.currentNumber + 1;

            await tx.numberSequence.update({
                where: {
                    id: sequence.id,
                },
                data: {
                    currentNumber: nextNumber,
                },
            });

            const formattedNumber =
                sequence.prefix +
                String(nextNumber).padStart(sequence.padding, '0');

            return {
                raw: nextNumber,
                formatted: formattedNumber,
            };
        });
    }

    // reset (اختیاری)
    async reset(organizationId: string, entity: string) {
        return this.prisma.numberSequence.update({
            where: {
                organizationId_entity: {
                    organizationId,
                    entity,
                },
            },
            data: {
                currentNumber: 0,
            },
        });
    }
}