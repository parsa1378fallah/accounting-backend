import { Permissions } from './../decorators/permisions.decorator';
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PERMISSION_KEY } from "../decorators/permisions.decorator";

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
            PERMISSION_KEY,
            [
                context.getHandler(),
                context.getClass()
            ]
        )

        if (!requiredPermissions) return true
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const userPermissions = user?.permissions || []
        return requiredPermissions.some(permission => userPermissions.includes(permission))
    }
}