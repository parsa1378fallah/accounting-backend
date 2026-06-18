import { IsString } from 'class-validator';

export class RemovePermissionDto {
    @IsString()
    permissionId: string;
}