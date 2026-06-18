import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrganizationDto, UpdateOrganizationDto } from './dto';



@Injectable()
export class OrganizationsService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async create(dto: CreateOrganizationDto) {
        return this.prisma.organization.create({
            data: dto,
        });
    }

    async findAll() {
        return this.prisma.organization.findMany({
            where: {
                deletedAt: null,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async findOne(id: string) {
        const organization =
            await this.prisma.organization.findUnique({
                where: { id },
            });

        if (!organization) {
            throw new NotFoundException(
                'Organization not found',
            );
        }

        return organization;
    }

    async update(
        id: string,
        dto: UpdateOrganizationDto,
    ) {
        await this.findOne(id);

        return this.prisma.organization.update({
            where: { id },
            data: dto,
        });
    }

    async remove(id: string) {
        await this.findOne(id);

        return this.prisma.organization.update({
            where: { id },
            data: {
                deletedAt: new Date(),
                isActive: false,
            },
        });
    }
}