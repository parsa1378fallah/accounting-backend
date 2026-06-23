import {
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';

import { PassportStrategy } from '@nestjs/passport';

import {
    ExtractJwt,
    Strategy,
} from 'passport-jwt';

import { PrismaService } from 'src/prisma/prisma.service';

import { AUTH_CONSTANTS } from '../constants/auth.constants';

import { JwtPayload } from '../interfaces/jwt-payload.interface';

import { CurrentUser } from '../interfaces/current-user.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(
    Strategy,
    'jwt',
) {
    constructor(
        private readonly prisma: PrismaService,
    ) {
        super({
            jwtFromRequest:
                ExtractJwt.fromAuthHeaderAsBearerToken(),

            secretOrKey: AUTH_CONSTANTS.jwtSecret,

            ignoreExpiration: false,
        });
    }

    async validate(
        payload: JwtPayload,
    ): Promise<CurrentUser> {
        const user =
            await this.prisma.user.findUnique({
                where: {
                    id: payload.sub,
                },

                select: {
                    id: true,

                    email: true,

                    isActive: true,

                    deletedAt: true,

                    organizationId: true,

                    userRoles: {
                        select: {
                            role: {
                                select: {
                                    name: true,

                                    rolePermissions: {
                                        select: {
                                            permission: {
                                                select: {
                                                    key: true,
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });
        console.log(user)
        if (!user) {
            throw new UnauthorizedException(
                'User not found',
            );
        }

        if (!user.isActive) {
            throw new UnauthorizedException(
                'User is inactive',
            );
        }

        if (user.deletedAt) {
            throw new UnauthorizedException(
                'User has been deleted',
            );
        }

        // if (!user.organizationId) {
        //     throw new UnauthorizedException(
        //         'Organization not assigned',
        //     );
        // }

        const roles = user.userRoles.map(
            ur => ur.role.name,
        );

        const permissions = [
            ...new Set(
                user.userRoles.flatMap(ur =>
                    ur.role.rolePermissions.map(
                        rp => rp.permission.key,
                    ),
                ),
            ),
        ];

        return {
            id: user.id,

            email: user.email,

            organizationId:
                user.organizationId,

            roles,

            permissions,
        };
    }
}