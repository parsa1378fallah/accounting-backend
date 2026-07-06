// این فایل فقط یک مرجع است. Schema در schema.prisma است
/*
  model JournalTemplateLine {
    id String @id @default(cuid())

    organizationId String

    templateId String
    accountId  String
    isDebit    Boolean
    amountType TemplateAmountType

    amount     Decimal? @db.Decimal(20, 4)
    percentage Decimal? @db.Decimal(8, 4)

    formula Json?
    description String?
    sortOrder   Int     @default(0)

    costCenterId String?
    projectId    String?
    currencyId   String?

    createdAt DateTime  @default(now())
    updatedAt DateTime  @updatedAt
    deletedAt DateTime?

    template   JournalTemplate @relation(fields: [templateId], references: [id], onDelete: Cascade)
    account    Account         @relation(fields: [accountId], references: [id])
    costCenter CostCenter?     @relation(fields: [costCenterId], references: [id])
    project    Project?        @relation(fields: [projectId], references: [id])
    currency   Currency?       @relation(fields: [currencyId], references: [id])

    @@index([organizationId, templateId])
    @@index([templateId, sortOrder])
    @@index([accountId])
  }
*/

export interface PrismaJournalTemplateLineModel {
    id: string;
    organizationId: string;
    templateId: string;
    accountId: string;
    isDebit: boolean;
    amountType: string;
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