import { ApiProperty } from '@nestjs/swagger';

import { Prisma, ProjectStatus } from '@prisma/client';

export class ProjectResponseDto {

    @ApiProperty()
    id: string;

    @ApiProperty()
    organizationId: string;

    @ApiProperty()
    code: string;

    @ApiProperty()
    name: string;

    @ApiProperty({
        enum: ProjectStatus,
    })
    status: ProjectStatus;

    @ApiProperty({
        required: false,
        nullable: true,
    })
    startDate: Date | null;

    @ApiProperty({
        required: false,
        nullable: true,
    })
    endDate: Date | null;

    @ApiProperty({
        required: false,
        nullable: true,
        example: 250000000,
    })
    budget: Prisma.Decimal | null;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}