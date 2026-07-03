// src/modules/accounting/journal-template/services/recurring-journal.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RecurringFrequencyStrategyFactory } from '../strategies/recurring-frequency.strategy';
import { CreateRecurringJournalDto } from '../dto/create-recurring-journal.dto'; // بعداً بسازید
import { RecurringJournalQueryDto } from '../dto/recurring-journal-query.dto';

@Injectable()
export class RecurringJournalService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly frequencyStrategyFactory: RecurringFrequencyStrategyFactory,
    ) { }

    /**
     * ایجاد سند تکراری جدید از روی قالب
     */
    async createFromTemplate(
        templateId: string,
        dto: any, // بعداً DTO اختصاصی بسازید
        createdById: string,
        organizationId: string,
    ) {
        // بررسی وجود قالب
        const template = await this.prisma.journalTemplate.findFirst({
            where: { id: templateId, organizationId, isActive: true },
        });

        if (!template) {
            throw new NotFoundException('قالب مورد نظر یافت نشد یا غیرفعال است');
        }

        // محاسبه تاریخ اجرای بعدی
        const nextRunDate = this.calculateInitialNextRunDate(dto.startDate, dto.frequency);

        return this.prisma.recurringJournal.create({
            data: {
                organizationId,
                templateId,
                name: dto.name || `تکراری - ${template.name}`,
                frequency: dto.frequency,
                startDate: dto.startDate,
                endDate: dto.endDate,
                nextRunDate,
                amount: dto.amount,
                description: dto.description,
                createdById,
            },
            include: {
                template: true,
            },
        });
    }

    /**
     * لیست اسناد تکراری
     */
    async findAll(query: RecurringJournalQueryDto, organizationId: string) {
        const { skip, limit, isActive, frequency } = query;

        const where: any = {
            organizationId,
            deletedAt: null
        };

        if (isActive !== undefined) where.isActive = isActive;
        if (frequency) where.frequency = frequency;

        const [data, total] = await Promise.all([
            this.prisma.recurringJournal.findMany({
                where,
                include: {
                    template: true
                },
                skip,
                take: limit,
                orderBy: { nextRunDate: 'asc' },
            }),
            this.prisma.recurringJournal.count({ where }),
        ]);

        return { data, total, page: query.page, limit: query.limit };
    }

    /**
     * به‌روزرسانی تاریخ اجرای بعدی
     */
    async updateNextRunDate(id: string) {
        const recurring = await this.prisma.recurringJournal.findUnique({
            where: { id },
        });

        if (!recurring) throw new NotFoundException('سند تکراری یافت نشد');

        const strategy = this.frequencyStrategyFactory.getStrategy(recurring.frequency);
        const nextRunDate = strategy.calculateNextRun(recurring.nextRunDate);

        return this.prisma.recurringJournal.update({
            where: { id },
            data: {
                lastRunDate: new Date(),
                nextRunDate,
            },
        });
    }

    /**
     * محاسبه تاریخ اجرای اولیه
     */
    private calculateInitialNextRunDate(startDate: Date, frequency: any): Date {
        const strategy = this.frequencyStrategyFactory.getStrategy(frequency);
        return strategy.calculateNextRun(startDate);
    }

    async findOne(id: string, organizationId: string) {
        const recurring = await this.prisma.recurringJournal.findFirst({
            where: { id, organizationId },
            include: { template: true },
        });

        if (!recurring) throw new NotFoundException('سند تکراری یافت نشد');

        return recurring;
    }
}