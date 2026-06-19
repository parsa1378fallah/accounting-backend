// src/rbac/user-roles/dto/assign-role.dto.ts
import { IsString } from 'class-validator';

export class AssignRoleDto {
    @IsString()
    userId: string;

    @IsString()
    roleId: string;

    @IsString()
    organizationId: string;
}