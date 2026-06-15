import { Injectable, NestMiddleware } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { AUTH_CONSTANTS } from 'src/auth/constants/auth.constants';

@Injectable()
export class OrganizationMiddleware implements NestMiddleware {
    use(req: any, res: any, next: () => void) {
        const authHeader = req.headers.authorization;

        if (authHeader) {
            const token = authHeader.split(' ')[1];

            try {
                const decoded: any = jwt.verify(
                    token,
                    AUTH_CONSTANTS.jwtSecret,
                );

                req.orgId = decoded.orgId;
            } catch (e) {
                req.orgId = null;
            }
        }

        next();
    }
}