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
exports.PharmacyService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PharmacyService = class PharmacyService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async searchPharmacies(searchDto) {
        const { postcode, name, odsCode, page = 1, limit = 10 } = searchDto;
        const where = {};
        if (postcode) {
            where.postcode = { contains: postcode, mode: 'insensitive' };
        }
        if (name) {
            where.name = { contains: name, mode: 'insensitive' };
        }
        if (odsCode) {
            where.odsCode = { equals: odsCode };
        }
        const skip = (page - 1) * limit;
        const [pharmacies, total] = await Promise.all([
            this.prisma.pharmacy.findMany({
                where,
                skip,
                take: limit,
                orderBy: { name: 'asc' },
            }),
            this.prisma.pharmacy.count({ where }),
        ]);
        return {
            data: pharmacies,
            meta: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async getPharmacyById(id) {
        const pharmacy = await this.prisma.pharmacy.findUnique({
            where: { id },
        });
        if (!pharmacy) {
            throw new common_1.NotFoundException('Pharmacy not found');
        }
        return pharmacy;
    }
};
exports.PharmacyService = PharmacyService;
exports.PharmacyService = PharmacyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PharmacyService);
//# sourceMappingURL=pharmacy.service.js.map