import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
} from 'class-validator';

export class CreateAccountDto {
    @ApiProperty({
        example: 'cmf4kzj8q0000x8abc123456',
        description: 'Organization ID',
    })
    @IsString()
    @IsNotEmpty()
    organizationId: string;

    @ApiProperty({
        example: 'cmf4kzj8q0000x8abc654321',
        description: 'Account Category ID',
    })
    @IsString()
    @IsNotEmpty()
    accountCategoryId: string;

    @ApiPropertyOptional({
        example: 'cmf4kzj8q0000x8abc777777',
        description:
            'Parent Account ID (optional for root accounts)',
    })
    @IsOptional()
    @IsString()
    parentId?: string;

    @ApiProperty({
        example: '110101',
        description:
            'Unique account code within organization',
    })
    @IsString()
    @MaxLength(50)
    @IsNotEmpty()
    code: string;

    @ApiProperty({
        example: 'Main Cash Box',
        description: 'Account name',
    })
    @IsString()
    @MaxLength(255)
    @IsNotEmpty()
    name: string;
}