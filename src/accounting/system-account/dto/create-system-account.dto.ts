import { ApiProperty } from '@nestjs/swagger';
import { SystemAccountKey } from '@prisma/client';

import {
    IsEnum,
    IsNotEmpty,
    IsString,
} from 'class-validator';

export class CreateSystemAccountDto {
    @ApiProperty({
        description: 'Organization ID',
        example: 'cmc123abc456xyz789',
    })
    @IsString()
    @IsNotEmpty()
    organizationId: string;
    @ApiProperty({
        description: 'name system',
        example: 'xxx',
    })
    @IsString()
    @IsNotEmpty()
    name: string;
    @ApiProperty({
        description: 'System account key',
        enum: SystemAccountKey,
        example: SystemAccountKey.CASH,
    })
    @IsEnum(SystemAccountKey)
    key: SystemAccountKey;

    @ApiProperty({
        description: 'Leaf account ID',
        example: 'cmc789xyz123abc456',
    })
    @IsString()
    @IsNotEmpty()
    accountId: string;
}