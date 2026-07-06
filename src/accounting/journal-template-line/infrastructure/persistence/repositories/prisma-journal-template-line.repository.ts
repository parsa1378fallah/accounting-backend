import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JournalTemplateLine } from '../../../domain/entities/journal-template-line.entity';
import { TemplateLineId } from '../../../domain/value-objects/template-line-id.value-object';
import { JournalTemplateLineRepository } from '../../../domain/repositories/journal-template-line.repository.interface';
import { JournalTemplateLPersistenceMapper } from '../mappers/journal-template-line-persistence.mapper';

@Injectable()
export class PrismaJournalTemplateLineRepository
    implements JournalTemplateLineRepository {
    private readonly logger = new Logger(
        PrismaJournalTemplateLineRepository.name,
    );

    constructor(
        private readonly prisma: PrismaService,
        private readonly mapper: JournalTemplateLPersistenceMapper,
    ) { }

    async save(line: JournalTemplateLine): Promise<void> {
        this.logger.debug(`Saving journal template line: ${line.getId().value}`);

        try {
            const data = this.mapper.toPersistence(line);

            await this.prisma.journalTemplateLine.upsert({
                where: { id: data.id },
                create: data,
                update: {
                    ...data,
                    updatedAt: new Date(),
                },
            });

            this.logger.debug(
                `Journal template line saved: ${line.getId().value}`,
            );
        } catch (error) {
            this.logger.error(`Failed to save journal template line: ${error.message}`);
            throw error;
        }
    }

    async getById(id: TemplateLineId): Promise<JournalTemplateLine | null> {
        this.logger.debug(`Getting journal template line by id: ${id.value}`);

        try {
            const raw = await this.prisma.journalTemplateLine.findUnique({
                where: { id: id.value },
                include: {
                    template: true,
                    account: true,
                    costCenter: true,
                    project: true,
                    currency: true,
                },
            });

            if (!raw) {
                return null;
            }

            return this.mapper.toDomain(raw as any);
        } catch (error) {
            this.logger.error(`Failed to get journal template line: ${error.message}`);
            throw error;
        }
    }

    async findByTemplate(
        templateId: string,
        organizationId: string,
    ): Promise<JournalTemplateLine[]> {
        this.logger.debug(
            `Finding journal template lines by template: ${templateId}`,
        );

        try {
            const raw = await this.prisma.journalTemplateLine.findMany({
                where: {
                    templateId,
                    organizationId,
                    deletedAt: null,
                },
                orderBy: { sortOrder: 'asc' },
                include: {
                    account: true,
                    costCenter: true,
                    project: true,
                    currency: true,
                },
            });

            return this.mapper.toDomainCollection(raw as any);
        } catch (error) {
            this.logger.error(
                `Failed to find journal template lines: ${error.message}`,
            );
            throw error;
        }
    }

    async findByAccount(
        accountId: string,
        organizationId: string,
    ): Promise<JournalTemplateLine[]> {
        this.logger.debug(
            `Finding journal template lines by account: ${accountId}`,
        );

        try {
            const raw = await this.prisma.journalTemplateLine.findMany({
                where: {
                    accountId,
                    organizationId,
                    deletedAt: null,
                },
                include: {
                    template: true,
                    costCenter: true,
                    project: true,
                    currency: true,
                },
            });

            return this.mapper.toDomainCollection(raw as any);
        } catch (error) {
            this.logger.error(
                `Failed to find journal template lines by account: ${error.message}`,
            );
            throw error;
        }
    }

    async findByOrganization(
        organizationId: string,
    ): Promise<JournalTemplateLine[]> {
        this.logger.debug(
            `Finding journal template lines by organization: ${organizationId}`,
        );

        try {
            const raw = await this.prisma.journalTemplateLine.findMany({
                where: {
                    organizationId,
                    deletedAt: null,
                },
                orderBy: [{ templateId: 'asc' }, { sortOrder: 'asc' }],
                include: {
                    template: true,
                    account: true,
                    costCenter: true,
                    project: true,
                    currency: true,
                },
            });

            return this.mapper.toDomainCollection(raw as any);
        } catch (error) {
            this.logger.error(
                `Failed to find journal template lines by organization: ${error.message}`,
            );
            throw error;
        }
    }

    async delete(id: TemplateLineId): Promise<void> {
        this.logger.debug(`Soft deleting journal template line: ${id.value}`);

        try {
            await this.prisma.journalTemplateLine.update({
                where: { id: id.value },
                data: {
                    deletedAt: new Date(),
                },
            });

            this.logger.debug(
                `Journal template line deleted: ${id.value}`,
            );
        } catch (error) {
            this.logger.error(
                `Failed to delete journal template line: ${error.message}`,
            );
            throw error;
        }
    }

    async deleteByTemplate(templateId: string): Promise<void> {
        this.logger.debug(
            `Soft deleting journal template lines by template: ${templateId}`,
        );

        try {
            await this.prisma.journalTemplateLine.updateMany({
                where: {
                    templateId,
                    deletedAt: null,
                },
                data: {
                    deletedAt: new Date(),
                },
            });

            this.logger.debug(
                `Journal template lines deleted for template: ${templateId}`,
            );
        } catch (error) {
            this.logger.error(
                `Failed to delete journal template lines by template: ${error.message}`,
            );
            throw error;
        }
    }

    async count(templateId: string): Promise<number> {
        this.logger.debug(`Counting journal template lines for template: ${templateId}`);

        try {
            return await this.prisma.journalTemplateLine.count({
                where: {
                    templateId,
                    deletedAt: null,
                },
            });
        } catch (error) {
            this.logger.error(`Failed to count journal template lines: ${error.message}`);
            throw error;
        }
    }

    async existsById(id: TemplateLineId): Promise<boolean> {
        try {
            const count = await this.prisma.journalTemplateLine.count({
                where: {
                    id: id.value,
                    deletedAt: null,
                },
            });

            return count > 0;
        } catch (error) {
            this.logger.error(
                `Failed to check journal template line existence: ${error.message}`,
            );
            throw error;
        }
    }
}