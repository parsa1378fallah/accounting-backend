import { ApiProperty } from '@nestjs/swagger';
import {
    IsString,
    IsOptional,
    MinLength,
} from 'class-validator';

export class CreateRoleDto {
    @ApiProperty({ example: 'Admin' })
    @IsString()
    @MinLength(2)
    name: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ example: 'ADMIN' })
    @IsString()
    code: string
}