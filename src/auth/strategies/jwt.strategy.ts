import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AUTH_CONSTANTS } from '../constants/auth.constants';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: AUTH_CONSTANTS.jwtSecret,
        });
    }

    async validate(payload: JwtPayload) {
        console.log('USER');
        const user = await this.prisma.user.findUnique({
            where: {
                id: payload.sub,
            },
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
        console.log('USER:', user);
        return user;
    }
}