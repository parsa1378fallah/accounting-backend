import { Injectable } from '@nestjs/common';
import { Decimal } from 'decimal.js';
import { JournalTemplateLine } from '../../../domain/entities/journal-template-line.entity';
import { TemplateLineId } from '../../../domain/value-objects/template-line-id.value-object';
import { AmountType } from '../../../domain/value-objects/amount-type.value-object';
import { Formula } from '../../../domain/value-objects/formula.value-object';
import { LineAmount } from '../../../domain/value-objects/line-amount.value-object';
import { DebitCredit } from '../../../domain/value-objects/debit-credit.value-object';
import { SortOrder } from '../../../domain/value-objects/sort-order.value-object';
import { CalculationMetadata } from '../../../domain/value-objects/calculation-metadata.value-object';
import { TemplateAmountType } from '../../../common/enums/template-amount-type.enum';

/**
 * Interface برای داده‌های Prisma (همانند جدول دیتابیس)
 */
export interface PrismaJournalTemplateLineModel {
    id: string;
    organizationId: string;
    templateId: string;
    accountId: string;
    isDebit: boolean;
    amountType: TemplateAmountType; // ✅ باید از enum استفاده کند، نه string
    amount: string | null; // Decimal از DB به‌صورت string می‌آید
    percentage: string | null; // Decimal از DB به‌صورت string می‌آید
    formula: any; // JSON
    description: string | null;
    sortOrder: number;
    costCenterId: string | null;
    projectId: string | null;
    currencyId: string | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

/**
 * DTO برای ارسال به Prisma (create/update)
 */
export interface JournalTemplateLinePersistenceInput {
    id: string;
    organizationId: string;
    templateId: string;
    accountId: string;
    isDebit: boolean;
    amountType: TemplateAmountType; // ✅ باید از enum استفاده کند
    amount: string | null;
    percentage: string | null;
    formula: any;
    description: string | null;
    sortOrder: number;
    costCenterId: string | null;
    projectId: string | null;
    currencyId: string | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

@Injectable()
export class JournalTemplateLPersistenceMapper {
    /**
     * تبدیل Entity به Persistence Input (برای ذخیره در DB)
     */
    toPersistence(
        line: JournalTemplateLine,
    ): JournalTemplateLinePersistenceInput {
        return {
            id: line.getId().value,
            organizationId: line.getOrganizationId(),
            templateId: line.getTemplateId(),
            accountId: line.getAccountId(),
            isDebit: line.isDebitEntry(),
            amountType: line.getAmountType().value as TemplateAmountType, // ✅ تبدیل صحیح
            amount: line.getAmount()?.value.toString() || null,
            percentage: line.getPercentage()?.toString() || null,
            formula: line.getFormula()?.toJSON() || null,
            description: line.getDescription(),
            sortOrder: line.getSortOrder().value,
            costCenterId: line.getCostCenterId() || null,
            projectId: line.getProjectId() || null,
            currencyId: line.getCurrencyId() || null,
            createdAt: line.getMetadata().createdAt,
            updatedAt: line.getMetadata().updatedAt,
            deletedAt: line.getMetadata().deletedAt || null,
        };
    }

    /**
     * تبدیل Prisma Data به Domain Entity
     */
    toDomain(raw: PrismaJournalTemplateLineModel): JournalTemplateLine {
        return JournalTemplateLine.reconstruct({
            id: TemplateLineId.of(raw.id),
            templateId: raw.templateId,
            accountId: raw.accountId,
            isDebit: DebitCredit.create(raw.isDebit),
            amountType: AmountType.create(raw.amountType), // ✅ باید enum باشد
            amount: raw.amount ? LineAmount.create(raw.amount) : null,
            percentage: raw.percentage ? new Decimal(raw.percentage) : null,
            formula: raw.formula
                ? Formula.create(raw.formula.expression)
                : null,
            description: raw.description ?? undefined,
            sortOrder: SortOrder.create(raw.sortOrder),
            costCenterId: raw.costCenterId ?? undefined,
            projectId: raw.projectId ?? undefined,
            currencyId: raw.currencyId ?? undefined,
            organizationId: raw.organizationId,
            metadata: CalculationMetadata.create({
                createdAt: raw.createdAt,
                updatedAt: raw.updatedAt,
                deletedAt: raw.deletedAt,
                version: 1,
            }),
        });
    }

    /**
     * تبدیل آرایه Prisma Data به Domain Entities
     */
    toDomainCollection(raw: PrismaJournalTemplateLineModel[]): JournalTemplateLine[] {
        return raw.map(r => this.toDomain(r));
    }
}