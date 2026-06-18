import {
    IsString,
    IsOptional,
    MaxLength,
} from 'class-validator';

export class CreateBranchDto {
    @IsString()
    @MaxLength(50)
    code: string;

    @IsString()
    @MaxLength(200)
    name: string;

    @IsOptional()
    @IsString()
    @MaxLength(50)
    phone?: string;

    @IsOptional()
    @IsString()
    address?: string;
}