// src/modules/accounting/journal-template/repositories/journal-template.repository.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateJournalTemplateDto } from '../dto/create-journal-template.dto';
import { UpdateJournalTemplateDto } from '../dto/update-journal-template.dto';
import { JournalTemplateQueryDto } from '../dto/journal-template-query.dto';
import { JournalTemplateEntity } from '../entities/journal-template.entity';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class JournalTemplateRepository {
    constructor(private readonly prisma: PrismaService) { }

    async createWithLines(
        dto: CreateJournalTemplateDto,
        createdById: string,
        organizationId: string,
    ) {
        return this.prisma.$transaction(async (tx) => {
            const template = await tx.journalTemplate.create({
                data: {
                    organizationId,
                    name: dto.name,
                    type: dto.type,
                    description: dto.description,
                    isActive: dto.isActive ?? true,
                    createdById,
                },
            });

            // ایجاد خطوط
            if (dto.lines?.length) {
                await tx.journalTemplateLine.createMany({
                    data: dto.lines.map((line, index) => ({
                        templateId: template.id,
                        accountId: line.accountId,
                        isDebit: line.isDebit,
                        amountType: line.amountType,
                        amount: line.amount,
                        percentage: line.percentage,
                        description: line.description,
                        sortOrder: line.sortOrder ?? index,
                        costCenterId: line.costCenterId,
                        projectId: line.projectId,
                        currencyId: line.currencyId,
                    })),
                });
            }

            // بازگشت کامل با خطوط
            return this.findOneOrThrow(template.id, organizationId, tx);
        });
    }

    async findAll(query: JournalTemplateQueryDto, organizationId: string) {
        const { skip, limit, search, type, isActive, sortBy, order } = query;

        const where: any = {
            organizationId,
            deletedAt: null
        };

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (type) where.type = type;
        if (isActive !== undefined) where.isActive = isActive;

        const [data, total] = await Promise.all([
            this.prisma.journalTemplate.findMany({
                where,
                include: { lines: true },
                skip,
                take: limit,
                orderBy: sortBy ? { [sortBy]: order || 'desc' } : { createdAt: 'desc' },
            }),
            this.prisma.journalTemplate.count({ where }),
        ]);

        return {
            data: plainToInstance(JournalTemplateEntity, data),
            total,
            page: query.page,
            limit: query.limit,
        };
    }

    async findOneOrThrow(id: string, organizationId: string, tx?: any) {
        const prisma = tx || this.prisma;

        const template = await prisma.journalTemplate.findFirst({
            where: {
                id,
                organizationId,
                deletedAt: null
            },
            include: {
                lines: true
            },
        });

        if (!template) {
            throw new NotFoundException(`قالب با شناسه ${id} یافت نشد`);
        }

        return plainToInstance(JournalTemplateEntity, template);
    }

    async updateWithLines(
        id: string,
        dto: UpdateJournalTemplateDto,
        updatedById: string,
        organizationId: string,
    ) {
        return this.prisma.$transaction(async (tx) => {
            // به‌روزرسانی هدر قالب
            const template = await tx.journalTemplate.update({
                where: { id },
                data: {
                    name: dto.name,
                    type: dto.type,
                    description: dto.description,
                    isActive: dto.isActive,
                },
            });

            // اگر خطوط ارسال شده باشد → بازنویسی کامل خطوط
            if (dto.lines !== undefined) {
                // حذف خطوط قبلی
                await tx.journalTemplateLine.deleteMany({ where: { templateId: id } });

                // ایجاد خطوط جدید
                if (dto.lines.length > 0) {
                    await tx.journalTemplateLine.createMany({
                        data: dto.lines.map((line, index) => ({
                            templateId: id,
                            accountId: line.accountId,
                            isDebit: line.isDebit,
                            amountType: line.amountType,
                            amount: line.amount,
                            percentage: line.percentage,
                            description: line.description,
                            sortOrder: line.sortOrder ?? index,
                            costCenterId: line.costCenterId,
                            projectId: line.projectId,
                            currencyId: line.currencyId,
                        })),
                    });
                }
            }

            return this.findOneOrThrow(id, organizationId, tx);
        });
    }

    async softDelete(id: string, organizationId: string) {
        await this.findOneOrThrow(id, organizationId);

        return this.prisma.journalTemplate.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
}