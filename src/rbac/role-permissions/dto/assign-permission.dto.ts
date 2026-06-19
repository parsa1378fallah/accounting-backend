import { IsString } from 'class-validator';

export class AssignPermissionDto {
    @IsString()
    roleId: string;

    @IsString()
    permissionId: string;
}