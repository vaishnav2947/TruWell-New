// backend/src/modules/auth/auth.controller.ts
import { Controller, Post, Body, Get, Req, UseGuards, Request, Delete, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { MfaVerifyDto } from './dto/mfa-verify.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { UserRole } from './roles.enum';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    // First, validate the user
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Post('refresh')
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refresh(refreshTokenDto.refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: any, @Body() refreshTokenDto: RefreshTokenDto) {
    // The refresh token is in the body, and the user is in the request from the JWT guard
    return this.authService.logout(refreshTokenDto.refreshToken, req.user.sub);
  }

  @Post('mfa/setup')
  @UseGuards(JwtAuthGuard)
  async mfaSetup(@Req() req: any) {
    return this.authService.mfaSetup(req.user.sub);
  }

  @Post('mfa/verify')
  @UseGuards(JwtAuthGuard)
  async mfaVerify(@Req() req: any, @Body() mfaVerifyDto: MfaVerifyDto) {
    return this.authService.mfaVerify(req.user.sub, mfaVerifyDto);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  // Example of a protected route
  @Get('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PHARMACY_STAFF, UserRole.PHARMACY_OWNER, UserRole.PRESCRIBER, UserRole.SUPER_ADMIN)
  getProfile(@Req() req: any) {
    return req.user;
  }
}