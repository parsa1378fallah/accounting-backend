import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCurrencyDto } from './dto';

@Injectable()
export class CurrencyService {
    constructor(private readonly prisma: PrismaService) { }

    async create(dto: CreateCurrencyDto) {
        this.normalizeDto(dto);

        await this.checkDuplicate(dto.code);

        const shouldBeBase = await this.shouldBeBase(dto);

        return this.createCurrency(dto, shouldBeBase);
    }

    private normalizeDto(dto: CreateCurrencyDto) {
        dto.code = dto.code.trim().toUpperCase();
        dto.name = dto.name.trim();
        dto.symbol = dto.symbol?.trim();
    }

    private async checkDuplicate(code: string) {
        const exists = await this.prisma.currency.findFirst({
            where: {
                code,
                deletedAt: null,
            },
        });

        if (exists) {
            throw new ConflictException(
                `Currency "${code}" already exists.`,
            );
        }
    }

    private async shouldBeBase(
        dto: CreateCurrencyDto,
    ): Promise<boolean> {
        const count = await this.prisma.currency.count({
            where: {
                deletedAt: null,
            },
        });

        return count === 0 || dto.isBase === true;
    }

    private async createCurrency(
        dto: CreateCurrencyDto,
        shouldBeBase: boolean,
    ) {
        return this.prisma.$transaction(async (tx) => {
            if (shouldBeBase) {
                await tx.currency.updateMany({
                    where: {
                        isBase: true,
                    },
                    data: {
                        isBase: false,
                    },
                });
            }

            const currency = await tx.currency.create({
                data: {
                    code: dto.code,
                    name: dto.name,
                    symbol: dto.symbol,
                    decimalPlaces: dto.decimalPlaces ?? 2,
                    isBase: shouldBeBase,
                    isActive: true,
                },
            });

            return {
                id: currency.id,
                code: currency.code,
                name: currency.name,
                symbol: currency.symbol,
                decimalPlaces: currency.decimalPlaces,
                isBase: currency.isBase,
                isActive: currency.isActive,
                createdAt: currency.createdAt,
            };
        });
    }
}
