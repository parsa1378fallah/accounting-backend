import { IsOptional, IsString } from 'class-validator';

export class RoleFilterDto {
    @IsOptional()
    @IsString()
    search?: string;
}