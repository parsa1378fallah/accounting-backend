import {
    CanActivate,
    ExecutionContext,
    Injectable,
} from '@nestjs/common';

import { RequestContextService } from '../request-context/request-context.service';

@Injectable()
export class JwtContextGuard
    implements CanActivate {
    constructor(
        private readonly requestContext: RequestContextService,
    ) { }

    canActivate(
        context: ExecutionContext,
    ): boolean {
        const request =
            context.switchToHttp().getRequest();

        const user = request.user;

        if (user) {
            this.requestContext.setUserId(
                user.sub,
            );

            this.requestContext.setOrganizationId(
                user.orgId,
            );
        }

        return true;
    }
}