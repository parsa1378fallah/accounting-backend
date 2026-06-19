import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AUTH_CONSTANTS } from './constants/auth.constants';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwt: JwtService,
    ) { }

    // =========================
    // REGISTER
    // =========================
    async register(dto: RegisterDto) {
        const existing = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (existing) {
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

    // =========================
    // LOGIN
    // =========================
    async login(dto: LoginDto) {
        const user = await this.findUserByEmail(dto.email);

        const valid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!valid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const tokens = await this.generateTokens(user);
        await this.createSession(user.id, tokens.refreshToken);

        return tokens;
    }

    // =========================
    // ME
    // =========================
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

    // =========================
    // REFRESH TOKEN
    // =========================
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
            await this.prisma.userSession.delete({
                where: { id: session.id },
            });
            throw new UnauthorizedException('Session expired');
        }

        const valid = await bcrypt.compare(refreshToken, session.tokenHash);
        if (!valid) {
            throw new UnauthorizedException('Invalid session');
        }

        const user = await this.findUserById(payload.sub);

        await this.prisma.userSession.delete({
            where: { id: session.id },
        });

        const tokens = await this.generateTokens(user);
        await this.createSession(user.id, tokens.refreshToken);

        return tokens;
    }

    // =========================
    // LOGOUT
    // =========================
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

    // =========================
    // LOGOUT ALL
    // =========================
    async logoutAll(userId: string) {
        await this.prisma.userSession.deleteMany({
            where: { userId },
        });

        return { success: true };
    }

    // =========================
    // TOKENS (CLEAN JWT)
    // =========================
    private async generateTokens(user: User) {
        const payload = {
            sub: user.id,
            orgId: user.organizationId ?? null,
        };

        const accessToken = this.jwt.sign(payload, {
            secret: AUTH_CONSTANTS.jwtSecret,
            expiresIn: '15m',
        });

        const refreshToken = this.jwt.sign(payload, {
            secret: AUTH_CONSTANTS.jwtSecret,
            expiresIn: '30d',
        });

        return { accessToken, refreshToken };
    }

    // =========================
    // SESSION
    // =========================
    private async createSession(userId: string, refreshToken: string) {
        const tokenHash = await bcrypt.hash(refreshToken, 10);

        await this.prisma.userSession.create({
            data: {
                userId,
                tokenHash,
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
        });
    }

    // =========================
    // HELPERS
    // =========================
    private async findUserByEmail(email: string) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        if (!user.isActive) {
            throw new UnauthorizedException('User inactive');
        }

        if (user.deletedAt) {
            throw new UnauthorizedException('User deleted');
        }

        return user;
    }

    private async findUserById(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        if (!user.isActive) {
            throw new UnauthorizedException('User inactive');
        }

        if (user.deletedAt) {
            throw new UnauthorizedException('User deleted');
        }

        return user;
    }
}