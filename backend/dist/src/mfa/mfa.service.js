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
exports.MfaService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const speakeasy = require("speakeasy");
let MfaService = class MfaService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async initiateMfa(userId, method) {
        if (method === 'authenticator') {
            const secret = speakeasy.generateSecret({ length: 20 });
            return {
                method,
                secret: secret.base32,
            };
        }
        return {
            method,
            message: `Code sent via ${method}`,
        };
    }
    async verifyMfa(userId, dto) {
        const { token, method, secret } = dto;
        if (method === 'authenticator') {
            const verified = speakeasy.totp.verify({
                secret: secret || '',
                encoding: 'base32',
                token,
                window: 1,
            });
            if (!verified) {
                throw new common_1.UnauthorizedException('Invalid token');
            }
            return { verified: true };
        }
        if (token.length === 6 && /^\d+$/.test(token)) {
            return { verified: true };
        }
        throw new common_1.UnauthorizedException('Invalid token');
    }
};
exports.MfaService = MfaService;
exports.MfaService = MfaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MfaService);
//# sourceMappingURL=mfa.service.js.map