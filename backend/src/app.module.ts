import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import * as Joi from 'joi';
import { AuthModule } from './modules/auth/auth.module';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
// Other modules will be imported here

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
    // Other modules
  ],
  controllers: [HealthController],
  providers: [HealthService],
})
export class AppModule {}