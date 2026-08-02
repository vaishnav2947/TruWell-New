"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../../prisma/prisma.service");
const bcrypt = require("bcryptjs");
const speakeasy = require("speakeasy");
const crypto = require("crypto");
const email_service_1 = require("../../email/email.service");
const config_1 = require("@nestjs/config");
let AuthService = class AuthService {
    constructor(prisma, jwtService, emailService, config) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.emailService = emailService;
        this.config = config;
    }
    async validateUser(email, password) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (user && (await bcrypt.compare(password, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
    async login(user) {
        const payload = { email: user.email, sub: user.id, role: user.role };
        const accessToken = this.jwtService.sign(payload, {
            expiresIn: this.config.get('JWT_ACCESS_EXPIRATION_TIME', '15m'),
        });
        const refreshToken = this.jwtService.sign(payload, {
            expiresIn: this.config.get('JWT_REFRESH_EXPIRATION_TIME', '7d'),
        });
        await this.prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
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
    async refresh(refreshToken) {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: this.config.get('JWT_SECRET'),
            });
            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub },
            });
            if (!user) {
                throw new common_1.UnauthorizedException();
            }
            const storedToken = await this.prisma.refreshToken.findFirst({
                where: {
                    token: refreshToken,
                    userId: user.id,
                    expiresAt: { gt: new Date() },
                },
            });
            if (!storedToken) {
                throw new common_1.UnauthorizedException('Invalid refresh token');
            }
            const newPayload = { email: user.email, sub: user.id, role: user.role };
            const newAccessToken = this.jwtService.sign(newPayload, {
                expiresIn: this.config.get('JWT_ACCESS_EXPIRATION_TIME', '15m'),
            });
            const newRefreshToken = this.jwtService.sign(newPayload, {
                expiresIn: this.config.get('JWT_REFRESH_EXPIRATION_TIME', '7d'),
            });
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
                    firstName: user.name || '',
                    lastName: '',
                    role: user.role,
                },
            };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    async logout(refreshToken, userId) {
        await this.prisma.refreshToken.deleteMany({
            where: {
                token: refreshToken,
                userId,
            },
        });
        return { message: 'Logged out successfully' };
    }
    async mfaSetup(userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        const secret = speakeasy.generateSecret({ length: 20 });
        await this.prisma.user.update({
            where: { id: userId },
            data: { mfaSecret: secret.base32 },
        });
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
    async mfaVerify(userId, dto) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user || !user.mfaSecret) {
            throw new common_1.BadRequestException('MFA not set up for this user');
        }
        const verified = speakeasy.totp.verify({
            secret: user.mfaSecret,
            encoding: 'base32',
            token: dto.token,
            window: 1,
        });
        if (verified) {
            await this.prisma.user.update({
                where: { id: userId },
                data: { mfaEnabled: true },
            });
            return { message: 'MFA enabled successfully' };
        }
        else {
            throw new common_1.BadRequestException('Invalid token');
        }
    }
    async forgotPassword(dto) {
        const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (!user) {
            return { message: 'If the email exists, a reset link has been sent' };
        }
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                resetToken,
                resetTokenExpires,
            },
        });
        const resetUrl = `${this.config.get('FRONTEND_URL')}/reset-password?token=${resetToken}`;
        try {
            await this.emailService.sendEmail({
                prescriptionId: '',
                recipient: user.email,
                subject: 'Password Reset Request',
                htmlBody: `<p>Reset your password here: <a href="${resetUrl}">${resetUrl}</a></p>`,
            });
        }
        catch (e) {
        }
        return { message: 'If the email exists, a reset link has been sent' };
    }
    async resetPassword(dto) {
        const user = await this.prisma.user.findFirst({
            where: {
                resetToken: dto.token,
                resetTokenExpires: {
                    gt: new Date(),
                },
            },
        });
        if (!user) {
            throw new common_1.BadRequestException('Invalid or expired token');
        }
        const hashedPassword = await bcrypt.hash(dto.password, 10);
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        email_service_1.EmailService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map