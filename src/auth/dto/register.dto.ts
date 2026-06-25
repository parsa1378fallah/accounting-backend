import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator'
export class RegisterDto {
    @IsEmail()
    email: string;

    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsString()
    organizationName: string;

    @IsOptional()
    @IsString()
    legalName?: string;

    @IsOptional()
    @IsString()
    nationalId?: string;

    @IsOptional()
    @IsString()
    taxNumber?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsEmail()
    organizationEmail?: string;

    @IsOptional()
    @IsString()
    address?: string;
}