import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { User } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AUTH_CONSTANTS } from './constants/auth.constants';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwt: JwtService,
    ) { }

    async register(dto: RegisterDto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (existingUser) {
            throw new BadRequestException('Email already exists');
        }

        const passwordHash = await bcrypt.hash(dto.password, 10);

        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                firstName: dto.firstName,
                lastName: dto.lastName,
                passwordHash,
            },
        });

        const tokens = await this.generateTokens(user);
        await this.createSession(user.id, tokens.refreshToken);

        return tokens;
    }

    async login(dto: LoginDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
            include: {
                userRoles: {
                    include: {
                        role: {
                            include: {
                                rolePermissions: {
                                    include: { permission: true },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const valid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!valid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        if (!user.isActive) {
            throw new UnauthorizedException('User is inactive');
        }

        if (user.deletedAt) {
            throw new UnauthorizedException('User is deleted');
        }

        const roles = user.userRoles.map((ur) => ur.role.name);


        const permissions = user.userRoles.flatMap((ur) =>
            ur.role.rolePermissions.map((rp) => rp.permission.key),
        );

        const tokens = await this.generateTokens(user, roles, permissions);
        await this.createSession(user.id, tokens.refreshToken);

        return tokens;
    }

    async me(userId: string) {
        return this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                organizationId: true,
                isActive: true,
                createdAt: true,
            },
        });
    }


    private async generateTokens(
        user: User,
        roles: string[] = [],
        permissions: string[] = [],
    ) {
        const payload: any = {
            sub: user.id,
            email: user.email,
            roles,
            permissions,
        };

        if (user.organizationId) {
            payload.orgId = user.organizationId;
        }

        const accessToken = this.jwt.sign(payload, {
            secret: AUTH_CONSTANTS.jwtSecret,
            expiresIn: 60 * 15,
        });

        const refreshToken = this.jwt.sign(payload, {
            secret: AUTH_CONSTANTS.jwtSecret,
            expiresIn: 60 * 60 * 24,
        });

        return { accessToken, refreshToken };
    }

    private async createSession(userId: string, refreshToken: string) {
        const tokenHash = await bcrypt.hash(refreshToken, 10);

        await this.prisma.userSession.create({
            data: {
                userId,
                tokenHash,
                expiresAt: new Date(
                    Date.now() + 30 * 24 * 60 * 60 * 1000,
                ),
            },
        });
    }

    async refresh(refreshToken: string) {
        let payload: any;
        try {
            payload = this.jwt.verify(refreshToken, {
                secret: AUTH_CONSTANTS.jwtSecret,
            });
        } catch {
            throw new UnauthorizedException('Invalid refresh token');
        }

        const session = await this.prisma.userSession.findFirst({
            where: { userId: payload.sub },
            orderBy: { createdAt: 'desc' },
        });

        if (!session) {
            throw new UnauthorizedException('Session not found');
        }


        if (session.expiresAt < new Date()) {
            await this.prisma.userSession.delete({ where: { id: session.id } });
            throw new UnauthorizedException('Session expired');
        }

        const valid = await bcrypt.compare(refreshToken, session.tokenHash);
        if (!valid) {
            throw new UnauthorizedException('Invalid session');
        }

        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
            include: {
                userRoles: {
                    include: {
                        role: {
                            include: {
                                rolePermissions: {
                                    include: { permission: true },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        if (!user.isActive || user.deletedAt) {
            throw new UnauthorizedException('User is inactive or deleted');
        }

        const roles = user.userRoles.map((ur) => ur.role.name);
        const permissions = user.userRoles.flatMap((ur) =>
            ur.role.rolePermissions.map((rp) => rp.permission.key),
        );


        await this.prisma.userSession.delete({ where: { id: session.id } });
        const tokens = await this.generateTokens(user, roles, permissions);
        await this.createSession(user.id, tokens.refreshToken);

        return tokens;
    }

    async logout(refreshToken: string) {
        let payload: any;
        try {
            payload = this.jwt.verify(refreshToken, {
                secret: AUTH_CONSTANTS.jwtSecret,
            });
        } catch {

            throw new UnauthorizedException('Invalid refresh token');
        }


        const sessions = await this.prisma.userSession.findMany({
            where: { userId: payload.sub },
        });

        for (const session of sessions) {
            const valid = await bcrypt.compare(refreshToken, session.tokenHash);
            if (valid) {
                await this.prisma.userSession.delete({
                    where: { id: session.id },
                });
                return { success: true };
            }
        }

        throw new UnauthorizedException('Session not found');
    }

    async logoutAll(userId: string) {
        await this.prisma.userSession.deleteMany({ where: { userId } });
        return { success: true };
    }
}
