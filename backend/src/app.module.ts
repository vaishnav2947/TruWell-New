import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import * as Joi from 'joi';
import { AuthModule } from './modules/auth/auth.module';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { LoggerModule } from 'nestjs-pino';
import { PrismaModule } from './prisma/prisma.module';
import { MfaModule } from './mfa/mfa.module';
import { SignatureModule } from './signature/signature.module';
import { PharmacyModule } from './pharmacy/pharmacy.module';
import { PdfModule } from './pdf/pdf.module';
import { EmailModule } from './email/email.module';
import { DeliveryTrackingModule } from './delivery-tracking/delivery-tracking.module';
import { NotificationModule } from './notification/notification.module';
import { QueueModule } from './queue/queue.module';

@Module({
  imports: [
    ConfigModule.forRoot({
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
        // Addr: as required for your services
      }),
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 10,
      },
    ]),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        transport:
          process.env.NODE_ENV === 'development'
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
    AuthModule,
    PrismaModule,
    MfaModule,
    SignatureModule,
    PharmacyModule,
    PdfModule,
    EmailModule,
    DeliveryTrackingModule,
    NotificationModule,
    QueueModule,
  ],
  controllers: [HealthController],
  providers: [HealthService],
})
export class AppModule {}