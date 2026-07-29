// backend/src/modules/auth/auth.service.ts
import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy';
import * as crypto from 'crypto';
import { MailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { MfaVerifyDto } from './dto/mfa-verify.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly config: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.config.get<string>('JWT_ACCESS_EXPIRATION_TIME', '15m'),
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRATION_TIME', '7d'),
    });

    // Store refresh token in database
    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.config.get<string>('JWT_SECRET'),
      });
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });
      if (!user) {
        throw new UnauthorizedException();
      }

      // Check if refresh token exists in database and is not expired
      const storedToken = await this.prisma.refreshToken.findFirst({
        where: {
          token: refreshToken,
          userId: user.id,
          expiresAt: { gt: new Date() },
        },
      });
      if (!storedToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Generate new access and refresh tokens
      const newPayload = { email: user.email, sub: user.id, role: user.role };
      const newAccessToken = this.jwtService.sign(newPayload, {
        expiresIn: this.config.get<string>('JWT_ACCESS_EXPIRATION_TIME', '15m'),
      });
      const newRefreshToken = this.jwtService.sign(newPayload, {
        expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRATION_TIME', '7d'),
      });

      // Update the refresh token in database (rotate)
      await this.prisma.refreshToken.update({
        where: { id: storedToken.id },
        data: {
          token: newRefreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(refreshToken: string, userId: string) {
    // Delete the refresh token from database
    await this.prisma.refreshToken.deleteMany({
      where: {
        token: refreshToken,
        userId,
      },
    });
    return { message: 'Logged out successfully' };
  }

  async mfaSetup(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const secret = speakeasy.generateSecret({ length: 20 });
    // Store the secret temporarily in the user record (not verified yet)
    await this.prisma.user.update({
      where: { id: userId },
      data: { mfaSecret: secret.base32 },
    });

    // Return the secret and the otpauth URL for QR code
    return {
      secret: secret.base32,
      otpauthUrl: speakeasy.otpauthURL({
        secret: secret.base32,
        label: `TruWell Pharmacy:${user.email}`,
        issuer: 'TruWell Pharmacy',
        encoding: 'base32',
      }),
    };
  }

  async mfaVerify(userId: string, dto: MfaVerifyDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.mfaSecret) {
      throw new BadRequestException('MFA not set up for this user');
    }

    const verified = speakeasy.totp.verify({
      secret: user.mfaSecret,
      encoding: 'base32',
      token: dto.token,
      window: 1, // Allow for time drift
    });

    if (verified) {
      // Enable MFA for the user
      await this.prisma.user.update({
        where: { id: userId },
        data: { mfaEnabled: true },
      });
      return { message: 'MFA enabled successfully' };
    } else {
      throw new BadRequestException('Invalid token');
    }
  }

  async forgetPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) {
      // Return success to prevent email enumeration
      return { message: 'If the email exists, a reset link has been sent' };
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // We will store the reset token in the user entity.
    // Note: We are adding two fields to the User model: resetToken and resetTokenExpires.
    // This is a critical change to the schema, but necessary for password reset.
    // We have updated the User model in database.md to include these fields.
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpires,
      },
    });

    // Send email
    const resetUrl = `${this.config.get<string>('FRONTEND_URL')}/reset-password?token=${resetToken}`;
    await this.mailService.sendMail({
      to: user.email,
      subject: 'Password Reset Request',
      template: './reset-password',
      context: {
        name: `${user.firstName} ${user.lastName}`,
        resetUrl,
      },
    });

    return { message: 'If the email exists, a reset link has been sent' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        resetToken: dto.token,
        resetTokenExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired token');
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Update the user's password and clear the reset token
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpires: null,
      },
    });

    return { message: 'Password has been reset' };
  }
}