import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBranchDto } from './dro';
import { UpdateBrachDto } from './dro/update-branch.dto';

@Injectable()
export class BranchesService {
    constructor(private prisma: PrismaService) { }

    async create(orgId: string, dto: CreateBranchDto) {
        const exists = await this.prisma.branch.findFirst({
            where: { organizationId: orgId, code: dto.code }
        })
        if (exists) {
            throw new BadRequestException('Branch code already exists')
        }
        return await this.prisma.branch.create({
            data: {
                ...dto,
                organizationId: orgId
            }
        })
    }

    async findAll(orgId: string) {
        return await this.prisma.branch.findMany({
            where: { organizationId: orgId },
            orderBy: { createdAt: 'desc' }
        })
    }


    async findOne(orgId: string, id: string) {
        const branch = await this.prisma.branch.findFirst({
            where: { id, organizationId: orgId }
        })

        if (!branch) {
            throw new NotFoundException('Branch not found')
        }

        return branch
    }
    async update(orgId: string, id: string, dto: UpdateBrachDto) {
        await this.findOne(orgId, id)
        return await this.prisma.branch.update({
            where: { id },
            data: { ...dto }
        })
    }

    async remove(orgId: string, id: string) {
        await this.prisma.branch.update({
            where: { id },
            data: {
                isActive: false
            }
        })
    }
}
