import {
    Body,
    Controller,
    Get,
    Post,
    UseGuards,
} from '@nestjs/common';

import {
    ApiTags,
    ApiOperation,
    ApiBearerAuth,
    ApiResponse,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, RefreshTokenDto } from './dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    @ApiOperation({ summary: 'Register new user' })
    @ApiResponse({ status: 201, description: 'User registered successfully' })
    register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @Post('login')
    @ApiOperation({ summary: 'Login user' })
    @ApiResponse({ status: 200, description: 'User logged in successfully' })
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get current user profile' })
    @ApiResponse({ status: 200, description: 'Current user data' })
    me(@CurrentUser() user: any) {
        return this.authService.me(user.id);
    }

    @Post('refresh')
    @ApiOperation({ summary: 'Refresh access token' })
    @ApiResponse({ status: 200, description: 'Token refreshed' })
    refresh(@Body() dto: RefreshTokenDto) {
        return this.authService.refresh(dto.refreshToken);
    }

    @Post('logout')
    @ApiOperation({ summary: 'Logout from current session' })
    @ApiResponse({ status: 200, description: 'Logged out successfully' })
    logout(@Body() dto: RefreshTokenDto) {
        return this.authService.logout(dto.refreshToken);
    }

    @Post('logout-all')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Logout from all devices' })
    @ApiResponse({ status: 200, description: 'Logged out from all sessions' })
    logoutAll(@CurrentUser() user: any) {
        return this.authService.logoutAll(user.id);
    }
}