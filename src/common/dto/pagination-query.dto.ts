// src/common/dto/pagination-query.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, Max, IsString, IsEnum } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export enum OrderDirection {
    ASC = 'asc',
    DESC = 'desc',
}

export class PaginationQueryDto {
    @ApiPropertyOptional({
        description: 'شماره صفحه (شروع از ۱)',
        default: 1,
        minimum: 1,
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(() => Number) // تبدیل خودکار string به number
    page: number = 1;

    @ApiPropertyOptional({
        description: 'تعداد رکورد در هر صفحه',
        default: 20,
        minimum: 1,
        maximum: 100,
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(100)
    @Type(() => Number)
    limit: number = 20;

    @ApiPropertyOptional({
        description: 'فیلد مرتب‌سازی',
        example: 'createdAt',
    })
    @IsOptional()
    @IsString()
    sortBy?: string;

    @ApiPropertyOptional({
        enum: OrderDirection,
        description: 'جهت مرتب‌سازی',
        default: OrderDirection.DESC,
    })
    @IsOptional()
    @IsEnum(OrderDirection)
    order: OrderDirection = OrderDirection.DESC;

    @ApiPropertyOptional({
        description: 'جستجوی کلی (full-text search)',
        example: 'فروش',
    })
    @IsOptional()
    @IsString()
    search?: string;

    // متد کمکی برای محاسبه skip (offset)
    get skip(): number {
        return (this.page - 1) * this.limit;
    }

    // متد کمکی برای تبدیل به Prisma options
    toPrismaOrderBy() {
        if (!this.sortBy) return undefined;

        return {
            [this.sortBy]: this.order,
        };
    }
}