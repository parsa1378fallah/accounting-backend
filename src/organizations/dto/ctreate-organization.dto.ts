import { ApiProperty } from '@nestjs/swagger';
import {
    IsString,
    IsOptional,
    IsEmail,
    MaxLength,
} from 'class-validator';

export class CreateOrganizationDto {
    @IsString()
    @MaxLength(200)
    name: string;

    @IsOptional()
    @IsString()
    @MaxLength(300)
    legalName?: string;

    @IsOptional()
    @IsString()
    @MaxLength(50)
    nationalId?: string;

    @IsOptional()
    @IsString()
    @MaxLength(50)
    taxNumber?: string;

    @IsOptional()
    @IsString()
    @MaxLength(50)
    phone?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    address?: string;



}