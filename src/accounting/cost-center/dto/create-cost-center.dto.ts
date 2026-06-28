import {
    ApiProperty,
    ApiPropertyOptional,
} from '@nestjs/swagger';

import {
    IsBoolean,
    IsOptional,
    IsString,
    IsUUID,
    Length,
} from 'class-validator';

export class CreateCostCenterDto {
    @ApiProperty()
    @IsUUID()
    organizationId: string;

    @ApiProperty({
        example: 'CC-100',
    })
    @IsString()
    @Length(1, 50)
    code: string;

    @ApiProperty({
        example: 'Sales Department',
    })
    @IsString()
    @Length(1, 200)
    name: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @Length(0, 1000)
    description?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsUUID()
    parentId?: string;

    @ApiPropertyOptional({
        default: true,
    })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean = true;
}