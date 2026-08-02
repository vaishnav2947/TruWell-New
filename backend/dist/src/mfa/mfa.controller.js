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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MfaController = void 0;
const common_1 = require("@nestjs/common");
const mfa_service_1 = require("./mfa.service");
const mfa_verify_dto_1 = require("./dto/mfa-verify.dto");
let MfaController = class MfaController {
    constructor(mfaService) {
        this.mfaService = mfaService;
    }
    async initiateMfa(body) {
        const { userId, method } = body;
        return this.mfaService.initiateMfa(userId, method);
    }
    async verifyMfa(mfaVerifyDto) {
        return this.mfaService.verifyMfa(mfaVerifyDto.userId, mfaVerifyDto);
    }
};
exports.MfaController = MfaController;
__decorate([
    (0, common_1.Post)('initiate'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MfaController.prototype, "initiateMfa", null);
__decorate([
    (0, common_1.Post)('verify'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mfa_verify_dto_1.MfaVerifyDto]),
    __metadata("design:returntype", Promise)
], MfaController.prototype, "verifyMfa", null);
exports.MfaController = MfaController = __decorate([
    (0, common_1.Controller)('mfa'),
    __metadata("design:paramtypes", [mfa_service_1.MfaService])
], MfaController);
//# sourceMappingURL=mfa.controller.js.map