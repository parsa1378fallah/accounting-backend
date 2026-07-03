// src/modules/accounting/journal-template/jobs/recurring-journal.processor.ts
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { JournalTemplateResolverService } from '../services/journal-template-resolver.service';
import { RecurringJournalService } from '../services/recurring-journal.service';
import { Decimal } from 'decimal.js';

export const RECURRING_JOURNAL_QUEUE = 'recurring-journals';

@Injectable()
@Processor(RECURRING_JOURNAL_QUEUE, {
    concurrency: 5,
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 50 },
})
export class RecurringJournalProcessor extends WorkerHost {
    private readonly logger = new Logger(RecurringJournalProcessor.name);

    constructor(
        private readonly recurringJournalService: RecurringJournalService,
        private readonly resolverService: JournalTemplateResolverService, // تغییر به ResolverService
    ) {
        super();
    }

    async process(job: Job): Promise<void> {
        const { recurringJournalId, organizationId } = job.data; // organizationId را هم بفرستید

        this.logger.log(`Processing recurring journal #${recurringJournalId} - Attempt ${job.attemptsMade + 1}`);

        try {
            // ۱. دریافت اطلاعات Recurring Journal
            const recurring = await this.recurringJournalService.findOne(recurringJournalId, organizationId);

            if (!recurring || !recurring.isActive) {
                this.logger.warn(`Recurring journal ${recurringJournalId} is inactive or not found`);
                return;
            }

            // ۲. اعمال قالب و ایجاد سند حسابداری (با ResolverService)
            const journalEntry = await this.resolverService.applyTemplate(
                {
                    templateId: recurring.templateId,
                    entryDate: new Date().toISOString(),
                    baseAmount: recurring.amount ? new Decimal(recurring.amount) : undefined,
                    description: recurring.description || `سند تکراری - ${recurring.name}`,
                    // branchId: recurring.branchId,
                },
                recurring.createdById || 'system', // کاربر سیستم یا creator
                organizationId,
            );

            // ۳. به‌روزرسانی تاریخ اجرای بعدی
            await this.recurringJournalService.updateNextRunDate(recurringJournalId);

            this.logger.log(`Successfully created journal entry ${journalEntry.entryNumber} from recurring ${recurring.name}`);

        } catch (error) {
            this.logger.error(`Failed to process recurring journal ${recurringJournalId}`, error.stack);
            throw error; // BullMQ خودش retry می‌کند
        }
    }
}