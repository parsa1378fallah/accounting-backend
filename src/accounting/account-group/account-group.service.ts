import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

import {
  CreateAccountGroupDto,
  UpdateAccountGroupDto,
  AccountGroupQueryDto,
} from './dto';

@Injectable()
export class AccountGroupsService {
  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async create(
    dto: CreateAccountGroupDto,
  ) {
    const exists =
      await this.prisma.accountGroup.findUnique({
        where: {
          code: dto.code,
        },
      });

    if (exists) {
      throw new ConflictException(
        'Account group code already exists',
      );
    }

    return this.prisma.accountGroup.create({
      data: {
        code: dto.code.trim(),
        name: dto.name.trim(),
        nature: dto.nature,
      },
    });
  }

  async findAll(
    query: AccountGroupQueryDto,
  ) {
    const { search } = query;

    return this.prisma.accountGroup.findMany({
      where: {
        ...(search && {
          OR: [
            {
              code: {
                contains: search,
              },
            },
            {
              name: {
                contains: search,
              },
            },
          ],
        }),
      },

      include: {
        _count: {
          select: {
            categories: true,
          },
        },
      },

      orderBy: {
        code: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const group =
      await this.prisma.accountGroup.findUnique({
        where: { id },

        include: {
          categories: true,
        },
      });

    if (!group) {
      throw new NotFoundException(
        'Account group not found',
      );
    }

    return group;
  }

  async update(
    id: string,
    dto: UpdateAccountGroupDto,
  ) {
    await this.findOne(id);

    if (dto.code) {
      const duplicate =
        await this.prisma.accountGroup.findFirst({
          where: {
            code: dto.code,
            id: {
              not: id,
            },
          },
        });

      if (duplicate) {
        throw new ConflictException(
          'Account group code already exists',
        );
      }
    }

    return this.prisma.accountGroup.update({
      where: { id },

      data: {
        ...(dto.code && {
          code: dto.code.trim(),
        }),

        ...(dto.name && {
          name: dto.name.trim(),
        }),

        ...(dto.nature && {
          nature: dto.nature,
        }),
      },
    });
  }

  async remove(id: string) {
    const group =
      await this.findOne(id);

    const categoryCount =
      await this.prisma.accountCategory.count({
        where: {
          accountGroupId: id,
        },
      });

    if (categoryCount > 0) {
      throw new BadRequestException(
        'Cannot delete account group with categories',
      );
    }

    return this.prisma.accountGroup.delete({
      where: { id },
    });
  }

  async summary() {
    const [
      totalGroups,
      totalCategories,
    ] =
      await this.prisma.$transaction([
        this.prisma.accountGroup.count(),

        this.prisma.accountCategory.count(),
      ]);

    return {
      totalGroups,
      totalCategories,
    };
  }
}