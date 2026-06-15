import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, refreshToken } from './dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    register(@Body() dto: RegisterDto) {
        return this.authService.register(dto)
    }

    @Post('login')
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto)
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    me(@CurrentUser() user: any) {
        return this.authService.me(user.id)
    }

    @Post('refresh')
    refresh(@Body() dto: refreshToken) {
        return this.authService.refresh(dto.refreshToken)
    }
    @Post('logout')
    logout(@Body() dto: refreshToken) {
        return this.authService.logout(dto.refreshToken)
    }
    @Post('logout-all')
    @UseGuards(JwtAuthGuard)
    logoutAll(@CurrentUser() user: any) {
        return this.authService.logoutAll(user.id)
    }
}
