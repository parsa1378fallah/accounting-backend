import { IsOptional, IsString } from 'class-validator';

export class PermissionFilterDto {
    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsString()
    module?: string;
}