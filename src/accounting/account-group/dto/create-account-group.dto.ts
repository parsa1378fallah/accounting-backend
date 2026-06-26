import { ApiProperty } from '@nestjs/swagger';

import {
    IsEnum,
    IsNotEmpty,
    IsString,
    MaxLength,
} from 'class-validator';

import { AccountNature } from '@prisma/client';

export class CreateAccountGroupDto {
    @ApiProperty({
        example: '1',
        description: 'Unique account group code',
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    code: string;

    @ApiProperty({
        example: 'Assets',
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name: string;

    @ApiProperty({
        enum: AccountNature,
        example: AccountNature.DEBIT,
    })
    @IsEnum(AccountNature)
    nature: AccountNature;
}