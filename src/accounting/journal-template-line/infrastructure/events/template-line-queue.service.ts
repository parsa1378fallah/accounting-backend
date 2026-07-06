import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { JournalTemplateLine } from '../../domain/entities/journal-template-line.entity';

@Injectable()
export class TemplateLineQueueService {
    private readonly logger = new Logger(TemplateLineQueueService.name);

    constructor(
        @InjectQueue('journal-template-line')
        private readonly queue: Queue,
    ) { }

    async syncTemplate(templateId: string, organizationId: string): Promise<void> {
        this.logger.log(`Queueing template sync: ${templateId}`);

        await this.queue.add(
            'sync-template',
            { templateId, organizationId },
            {
                removeOnComplete: true,
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 2000,
                },
            },
        );
    }

    async validateFormulas(templateId: string): Promise<void> {
        this.logger.log(`Queueing formula validation: ${templateId}`);

        await this.queue.add(
            'validate-formulas',
            { templateId },
            {
                removeOnComplete: true,
                attempts: 3,
            },
        );
    }

    async previewCalculation(
        templateId: string,
        organizationId: string,
        variables: Record<string, any>,
    ): Promise<void> {
        this.logger.log(`Queueing calculation preview: ${templateId}`);

        await this.queue.add(
            'preview-calculation',
            { templateId, organizationId, variables },
            {
                removeOnComplete: true,
            },
        );
    }

    async bulkImport(
        templateId: string,
        organizationId: string,
        data: any[],
    ): Promise<void> {
        this.logger.log(`Queueing bulk import: ${templateId}`);

        await this.queue.add(
            'bulk-import',
            { templateId, organizationId, data },
            {
                removeOnComplete: false,
                attempts: 5,
                backoff: {
                    type: 'exponential',
                    delay: 2000,
                },
            },
        );
    }

    async getJobStatus(jobId: string): Promise<any> {
        const job = await this.queue.getJob(jobId);
        if (!job) {
            return null;
        }

        return {
            id: job.id,
            name: job.name,
            state: await job.getState(),
            progress: job.progress,
            attempts: job.attemptsMade,
            failedReason: job.failedReason,
        };
    }
}