import { PrismaClient } from '@prisma/client'
import { ROLES, RoleCode } from './seeds/roles.seed'
import { PERMISSIONS } from './seeds/permissions.seed'
import { ROLE_PERMISSIONS } from './seeds/role-permissions'

const prisma = new PrismaClient()

// ================================================================
// HELPERS
// ================================================================

function log(emoji: string, msg: string) {
    console.log(`${emoji}  ${msg}`)
}

function warn(msg: string) {
    console.warn(`⚠️   ${msg}`)
}

// ================================================================
// STEP 1 — Seed Permissions
// ================================================================

async function seedPermissions() {
    log('🔐', `Seeding ${PERMISSIONS.length} permissions...`)

    const codes = PERMISSIONS.map((p) => p.code)
    const duplicates = codes.filter((c, i) => codes.indexOf(c) !== i)
    if (duplicates.length > 0) {
        throw new Error(`Duplicate permission codes: ${duplicates.join(', ')}`)
    }

    for (const permission of PERMISSIONS) {
        await prisma.permission.upsert({
            where: { key: permission.code },
            update: {
                module: permission.module,
                description: permission.name, // name رو در description ذخیره می‌کنیم
            },
            create: {
                key: permission.code,
                module: permission.module,
                description: permission.name,
            },
        })
    }

    log('✅', `${PERMISSIONS.length} permissions seeded`)
}

// ================================================================
// STEP 2 — Seed Roles
// ================================================================

async function seedRoles() {
    log('👥', `Seeding ${ROLES.length} roles...`)

    for (const role of ROLES) {
        const existingRole = await prisma.role.findFirst({
            where: {
                organizationId: null,
                code: role.code,
            },
        })

        if (existingRole) {
            await prisma.role.update({
                where: {
                    id: existingRole.id,
                },
                data: {
                    name: role.name,
                    description: role.description,
                    isSystem: role.isSystem,
                    isActive: role.isActive,
                },
            })
        } else {
            await prisma.role.create({
                data: {
                    organizationId: null,
                    code: role.code,
                    name: role.name,
                    description: role.description,
                    isSystem: role.isSystem,
                    isActive: role.isActive,
                },
            })
        }
    }

    log('✅', `${ROLES.length} roles seeded`)
}

// ================================================================
// STEP 3 — Seed RolePermissions
// ================================================================

async function seedRolePermissions() {
    log('🔗', 'Linking roles to permissions...')

    // بارگذاری همه permission ها برای تبدیل code به id
    const allPermissions = await prisma.permission.findMany()
    const permissionByCode = new Map(allPermissions.map((p) => [p.key, p]))

    // بارگذاری همه role ها
    const allRoles = await prisma.role.findMany({
        where: { organizationId: null },
    })
    const roleByCode = new Map(allRoles.map((r) => [r.code, r]))

    // OWNER و SUPER_ADMIN همه permission ها را می‌گیرند — خودکار
    const fullAccessRoles = [RoleCode.OWNER, RoleCode.SUPER_ADMIN]

    for (const roleCode of fullAccessRoles) {
        const role = roleByCode.get(roleCode)
        if (!role) {
            warn(`Role "${roleCode}" not found, skipping full-access assignment`)
            continue
        }

        // پاک کردن قدیمی‌ها و insert مجدد (idempotent)
        await prisma.rolePermission.deleteMany({ where: { roleId: role.id } })
        await prisma.rolePermission.createMany({
            data: allPermissions.map((p) => ({
                roleId: role.id,
                permissionId: p.id,
            })),
            skipDuplicates: true,
        })

        log('✅', `${roleCode}: ${allPermissions.length} permissions (full access)`)
    }

    // بقیه نقش‌ها از نگاشت دستی
    for (const [roleCode, permissionCodes] of Object.entries(ROLE_PERMISSIONS)) {
        const role = roleByCode.get(roleCode)
        if (!role) {
            warn(`Role "${roleCode}" not found in DB, skipping`)
            continue
        }

        // اعتبارسنجی: permission code های نامعتبر
        const invalidCodes = permissionCodes.filter((code) => !permissionByCode.has(code))
        if (invalidCodes.length > 0) {
            warn(`Role "${roleCode}" references unknown permission codes: ${invalidCodes.join(', ')}`)
        }

        const validPermissions = permissionCodes
            .map((code) => permissionByCode.get(code))
            .filter(Boolean) as typeof allPermissions

        // پاک کردن و insert مجدد (idempotent)
        await prisma.rolePermission.deleteMany({ where: { roleId: role.id } })
        await prisma.rolePermission.createMany({
            data: validPermissions.map((p) => ({
                roleId: role.id,
                permissionId: p.id,
            })),
            skipDuplicates: true,
        })

        log('✅', `${roleCode}: ${validPermissions.length} permissions`)
    }
}

// ================================================================
// STEP 4 — Validation
// ================================================================

async function validate() {
    log('🔍', 'Validating seed data...')

    const roleCount = await prisma.role.count()
    const permissionCount = await prisma.permission.count()
    const rolePermissionCount = await prisma.rolePermission.count()

    log('📊', `Roles: ${roleCount} | Permissions: ${permissionCount} | Links: ${rolePermissionCount}`)

    // بررسی نقش‌های بدون permission
    const rolesWithoutPermission = await prisma.role.findMany({
        where: {
            organizationId: null,
            rolePermissions: { none: {} },
        },
        select: { code: true, name: true },
    })

    if (rolesWithoutPermission.length > 0) {
        warn(`Roles with NO permissions: ${rolesWithoutPermission.map((r) => r.code).join(', ')}`)
    }

    log('✅', 'Validation complete')
}

// ================================================================
// MAIN
// ================================================================

async function main() {
    console.log('\n🚀  Starting enterprise RBAC seed...\n')

    await seedPermissions()
    console.log('')
    await seedRoles()
    console.log('')
    await seedRolePermissions()
    console.log('')
    await validate()

    console.log('\n🎉  Seed completed successfully!\n')
}

main()
    .catch((e) => {
        console.error('\n❌  Seed failed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
