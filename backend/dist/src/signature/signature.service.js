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
exports.SignatureService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SignatureService = class SignatureService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createSignature(createSignatureDto) {
        const { prescriptionId, signatureData, pharmacistName, gphcNumber, reason } = createSignatureDto;
        const prescription = await this.prisma.prescription.findUnique({
            where: { id: prescriptionId },
        });
        if (!prescription) {
            throw new common_1.BadRequestException('Prescription not found');
        }
        if (prescription.status !== 'locked' && prescription.status !== 'ready_for_signature') {
            throw new common_1.BadRequestException('Prescription is not ready for signature');
        }
        const signature = await this.prisma.digitalSignature.create({
            data: {
                prescriptionId,
                signatureData,
                signedBy: pharmacistName || 'unknown',
                fullName: pharmacistName,
                gphcNumber,
                signedAt: new Date(),
                reason,
            },
        });
        await this.prisma.prescription.update({
            where: { id: prescriptionId },
            data: { status: 'signed' },
        });
        return signature;
    }
};
exports.SignatureService = SignatureService;
exports.SignatureService = SignatureService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SignatureService);
//# sourceMappingURL=signature.service.js.map