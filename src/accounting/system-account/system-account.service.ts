import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Prisma, SystemAccountKey } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import {
    CreateSystemAccountDto,
    SystemAccountQueryDto,
    UpdateSystemAccountDto,
} from './dto';
import { PROTECTED_SYSTEM_ACCOUNTS } from './constants/protect-system-account.constant';





const SYSTEM_ACCOUNT_INCLUDE = {
    account: {
        select: {
            id: true,
            code: true,
            name: true,
            level: true,
            isLeaf: true,
            isActive: true,
        },
    },
    organization: {
        select: {
            id: true,
            name: true,
        },
    },
} satisfies Prisma.SystemAccountInclude

type AccountShape = {
    isLeaf: boolean
    isActive: boolean
    deletedAt: Date | null
}

@Injectable()
export class SystemAccountService {
    constructor(private readonly prisma: PrismaService) { }

    // ----------------------------------------------------------------
    // CREATE
    // ----------------------------------------------------------------
    async create(dto: CreateSystemAccountDto) {
        await this.validateOrganization(dto.organizationId)

        const account = await this.validateAccount(dto.accountId, dto.organizationId)
        this.ensureLeafAccount(account)
        this.ensureActiveAccount(account)

        await this.ensureUniqueKey(dto.organizationId, dto.key)
        await this.ensureAccountNotAlreadyAssigned(dto.accountId)

        return this.prisma.systemAccount.create({
            data: {
                organizationId: dto.organizationId,
                key: dto.key,
                name: dto.name,
                accountId: dto.accountId,
            },
            include: SYSTEM_ACCOUNT_INCLUDE,
        })
    }

    // ----------------------------------------------------------------
    // FIND ALL — با pagination و filter
    // ----------------------------------------------------------------
    async findAll(query: SystemAccountQueryDto) {
        const where = this.buildWhere(query)
        const orderBy = this.buildOrderBy(query)

        const page = query.page ?? 1
        const limit = query.limit ?? 20
        const skip = (page - 1) * limit

        const [data, total] = await this.prisma.$transaction([
            this.prisma.systemAccount.findMany({
                where,
                orderBy,
                skip,
                take: limit,
                include: SYSTEM_ACCOUNT_INCLUDE,
            }),
            this.prisma.systemAccount.count({ where }),
        ])

        return {
            data,
            meta: {
                total,
                page,
                limit,
                pageCount: Math.ceil(total / limit),
            },
        }
    }

    // ----------------------------------------------------------------
    // FIND ONE
    // ----------------------------------------------------------------
    async findOne(id: string) {
        const systemAccount = await this.prisma.systemAccount.findFirst({
            where: { id, deletedAt: null },
            include: SYSTEM_ACCOUNT_INCLUDE,
        })

        if (!systemAccount) {
            throw new NotFoundException('System account not found')
        }

        return systemAccount
    }

    // FIX: پیدا کردن system account بر اساس key — برای استفاده داخلی در سایر سرویس‌ها
    async findByKey(organizationId: string, key: SystemAccountKey) {
        const systemAccount = await this.prisma.systemAccount.findUnique({
            where: {
                organizationId_key: { organizationId, key },
            },
            include: SYSTEM_ACCOUNT_INCLUDE,
        })

        if (!systemAccount) {
            throw new NotFoundException(
                `System account with key "${key}" not found for this organization`,
            )
        }

        return systemAccount
    }

    // ----------------------------------------------------------------
    // UPDATE
    // ----------------------------------------------------------------
    async update(id: string, dto: UpdateSystemAccountDto) {
        const systemAccount = await this.findOne(id)

        if (dto.accountId) {
            const account = await this.validateAccount(
                dto.accountId,
                systemAccount.organizationId,
            )
            this.ensureLeafAccount(account)
            this.ensureActiveAccount(account)
            await this.ensureAccountNotAlreadyAssigned(dto.accountId, id)
        }

        if (dto.key) {
            // FIX: key نقش‌های protected قابل تغییر نیستند
            if (PROTECTED_SYSTEM_ACCOUNTS.includes(systemAccount.key)) {
                throw new BadRequestException(
                    `Key of protected system account "${systemAccount.key}" cannot be changed`,
                )
            }
            await this.ensureUniqueKey(systemAccount.organizationId, dto.key, id)
        }

        return this.prisma.systemAccount.update({
            where: { id },
            data: {
                key: dto.key ?? systemAccount.key,
                name: dto.name ?? systemAccount.name,
                accountId: dto.accountId ?? systemAccount.accountId,
            },
            include: SYSTEM_ACCOUNT_INCLUDE,
        })
    }

    // ----------------------------------------------------------------
    // ACTIVATE / DEACTIVATE — FIX: اضافه شد چون اسکیما isActive دارد
    // ----------------------------------------------------------------
    async deactivate(id: string) {
        const systemAccount = await this.findOne(id)

        this.ensureProtectedAccount(systemAccount.key)

        return this.prisma.systemAccount.update({
            where: { id },
            data: { isActive: false },
            include: SYSTEM_ACCOUNT_INCLUDE,
        })
    }

    async activate(id: string) {
        await this.findOne(id)

        return this.prisma.systemAccount.update({
            where: { id },
            data: { isActive: true },
            include: SYSTEM_ACCOUNT_INCLUDE,
        })
    }

    // ----------------------------------------------------------------
    // SOFT DELETE
    // ----------------------------------------------------------------
    async remove(id: string) {
        const systemAccount = await this.findOne(id)

        this.ensureProtectedAccount(systemAccount.key)

        await this.prisma.systemAccount.update({
            where: { id },
            // FIX: soft delete با deletedAt نه حذف فیزیکی
            data: { deletedAt: new Date(), isActive: false },
        })

        return { message: 'System account deleted successfully' }
    }

    // ----------------------------------------------------------------
    // RESTORE
    // ----------------------------------------------------------------
    async restore(id: string) {
        // FIX: برای restore باید رکوردهای soft-deleted رو هم پیدا کنیم
        const systemAccount = await this.prisma.systemAccount.findUnique({
            where: { id },
        })

        if (!systemAccount) {
            throw new NotFoundException('System account not found')
        }

        if (!systemAccount.deletedAt) {
            throw new BadRequestException('System account is not deleted')
        }

        return this.prisma.systemAccount.update({
            where: { id },
            data: { deletedAt: null, isActive: true },
            include: SYSTEM_ACCOUNT_INCLUDE,
        })
    }

    // ----------------------------------------------------------------
    // SUMMARY
    // ----------------------------------------------------------------
    async summary(organizationId: string) {
        await this.validateOrganization(organizationId)

        const [total, activeCount, byKey] = await this.prisma.$transaction([
            this.prisma.systemAccount.count({
                where: { organizationId, deletedAt: null },
            }),
            this.prisma.systemAccount.count({
                where: { organizationId, isActive: true, deletedAt: null },
            }),
            this.prisma.systemAccount.findMany({
                where: { organizationId, deletedAt: null },
                select: {
                    key: true,
                    name: true,
                    isActive: true,
                    account: { select: { code: true, name: true } },
                },
                orderBy: { key: 'asc' },
            }),
        ])

        // نقش‌هایی که هنوز تعریف نشده‌اند
        const definedKeys = new Set(byKey.map((b) => b.key))
        const missingKeys = Object.values(SystemAccountKey).filter(
            (k) => !definedKeys.has(k),
        )

        return {
            total,
            activeCount,
            inactiveCount: total - activeCount,
            accounts: byKey,
            missingKeys,
            isComplete: missingKeys.length === 0,
        }
    }

    // ================================================================
    // PRIVATE HELPERS
    // ================================================================

    private async validateOrganization(organizationId: string) {
        const organization = await this.prisma.organization.findFirst({
            where: { id: organizationId, deletedAt: null },
        })

        if (!organization) {
            throw new NotFoundException('Organization not found')
        }

        return organization
    }

    private async validateAccount(accountId: string, organizationId: string) {
        const account = await this.prisma.account.findFirst({
            where: { id: accountId, organizationId, deletedAt: null },
        })

        if (!account) {
            throw new NotFoundException('Account not found in this organization')
        }

        return account
    }

    private ensureLeafAccount(account: AccountShape) {
        if (!account.isLeaf) {
            throw new BadRequestException(
                'Only leaf accounts can be assigned as system accounts',
            )
        }
    }

    private ensureActiveAccount(account: AccountShape) {
        if (!account.isActive) {
            throw new BadRequestException('Account is inactive')
        }
    }

    private async ensureUniqueKey(
        organizationId: string,
        key: SystemAccountKey,
        excludeId?: string,
    ) {
        const exists = await this.prisma.systemAccount.findFirst({
            where: {
                organizationId,
                key,
                deletedAt: null,
                ...(excludeId && { id: { not: excludeId } }),
            },
        })

        if (exists) {
            throw new ConflictException(
                `System account key "${key}" already exists for this organization`,
            )
        }
    }

    private async ensureAccountNotAlreadyAssigned(
        accountId: string,
        excludeId?: string,
    ) {
        const exists = await this.prisma.systemAccount.findFirst({
            where: {
                accountId,
                deletedAt: null,
                ...(excludeId && { id: { not: excludeId } }),
            },
        })

        if (exists) {
            throw new ConflictException(
                'This account is already assigned to another system account',
            )
        }
    }

    private ensureProtectedAccount(key: SystemAccountKey) {
        if (PROTECTED_SYSTEM_ACCOUNTS.includes(key)) {
            throw new BadRequestException(
                `System account "${key}" is protected and cannot be modified`,
            )
        }
    }

    private buildWhere(query: SystemAccountQueryDto): Prisma.SystemAccountWhereInput {
        const where: Prisma.SystemAccountWhereInput = {
            deletedAt: null, // FIX: همیشه soft-deleted ها رو فیلتر کن
        }

        if (query.organizationId) {
            where.organizationId = query.organizationId
        }

        if (query.key) {
            where.key = query.key
        }

        if (query.accountId) {
            where.accountId = query.accountId
        }

        // FIX: اضافه شد چون اسکیما isActive دارد
        if (query.isActive !== undefined) {
            where.isActive = query.isActive
        }

        if (query.search) {
            where.OR = [
                { name: { contains: query.search } },
                { account: { name: { contains: query.search } } },
                { account: { code: { contains: query.search } } },
            ]
        }

        return where
    }

    private buildOrderBy(
        query: SystemAccountQueryDto,
    ): Prisma.SystemAccountOrderByWithRelationInput {
        const validSortFields = ['key', 'name', 'createdAt', 'updatedAt']
        const sortBy = validSortFields.includes(query.sortBy ?? '') ? query.sortBy! : 'key'

        return { [sortBy]: query.order ?? 'asc' }
    }
}