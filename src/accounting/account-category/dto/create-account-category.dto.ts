import { ApiProperty } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsString,
    MaxLength,
} from 'class-validator';

export class CreateAccountCategoryDto {
    @ApiProperty({
        example: 'cmfxxxxx',
        description: 'Account Group Id',
    })
    @IsString()
    @IsNotEmpty()
    accountGroupId: string;

    @ApiProperty({
        example: '11',
        description: 'Category Code',
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    code: string;

    @ApiProperty({
        example: 'Current Assets',
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    name: string;
}