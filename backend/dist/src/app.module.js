"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const Joi = require("joi");
const auth_module_1 = require("./modules/auth/auth.module");
const health_controller_1 = require("./health.controller");
const health_service_1 = require("./health.service");
const nestjs_pino_1 = require("nestjs-pino");
const prisma_module_1 = require("./prisma/prisma.module");
const mfa_module_1 = require("./mfa/mfa.module");
const signature_module_1 = require("./signature/signature.module");
const pharmacy_module_1 = require("./pharmacy/pharmacy.module");
const pdf_module_1 = require("./pdf/pdf.module");
const email_module_1 = require("./email/email.module");
const delivery_tracking_module_1 = require("./delivery-tracking/delivery-tracking.module");
const notification_module_1 = require("./notification/notification.module");
const queue_module_1 = require("./queue/queue.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                validationSchema: Joi.object({
                    NODE_ENV: Joi.string()
                        .valid('development', 'production', 'test')
                        .default('development'),
                    PORT: Joi.number().default(3001),
                    DATABASE_URL: Joi.string().required(),
                    JWT_SECRET: Joi.string().required(),
                    JWT_REFRESH_SECRET: Joi.string().required(),
                    JWT_ACCESS_EXPIRATION_TIME: Joi.string().default('15m'),
                    JWT_REFRESH_EXPIRATION_TIME: Joi.string().default('7d'),
                    SENDGRID_API_KEY: Joi.string().required(),
                    EMAIL_FROM: Joi.string().email().required(),
                }),
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60,
                    limit: 10,
                },
            ]),
            nestjs_pino_1.LoggerModule.forRoot({
                pinoHttp: {
                    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
                    transport: process.env.NODE_ENV === 'development'
                        ? {
                            target: 'pino-pretty',
                            options: {
                                singleLine: true,
                                colorize: true,
                            },
                        }
                        : undefined,
                },
            }),
            auth_module_1.AuthModule,
            prisma_module_1.PrismaModule,
            mfa_module_1.MfaModule,
            signature_module_1.SignatureModule,
            pharmacy_module_1.PharmacyModule,
            pdf_module_1.PdfModule,
            email_module_1.EmailModule,
            delivery_tracking_module_1.DeliveryTrackingModule,
            notification_module_1.NotificationModule,
            queue_module_1.QueueModule,
        ],
        controllers: [health_controller_1.HealthController],
        providers: [health_service_1.HealthService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map