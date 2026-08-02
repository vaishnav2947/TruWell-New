// backend/src/mfa/mfa.service.ts
import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MfaVerifyDto } from './dto/mfa-verify.dto';
import * as speakeasy from 'speakeasy';

@Injectable()
export class MfaService {
  constructor(private prisma: PrismaService) {}

  async initiateMfa(userId: string, method: 'email' | 'sms' | 'authenticator') {
    // In a real app, we would generate a code and send it via the chosen method
    // For simplicity, we'll generate a TOTP secret and return it for authenticator app
    // For email/SMS, we would integrate with a service

    if (method === 'authenticator') {
      const secret = speakeasy.generateSecret({ length: 20 });
      // Store the secret temporarily associated with the user
      // In a real app, we would save it to the user or a temporary table
      return {
        method,
        secret: secret.base32,
      };
    }

    // For email and SMS, we would generate a code and send it
    // We'll simulate by returning a generic response
    return {
      method,
      message: `Code sent via ${method}`,
    };
  }

  async verifyMfa(userId: string, dto: MfaVerifyDto) {
    const { token, method, secret } = dto;

    if (method === 'authenticator') {
      const verified = speakeasy.totp.verify({
        secret: secret || '',
        encoding: 'base32',
        token,
        window: 1, // Allow for time drift
      });

      if (!verified) {
        throw new UnauthorizedException('Invalid token');
      }

      return { verified: true };
    }

    // For email and SMS, we would check against a stored code
    // We'll simulate by accepting any 6-digit code for demo
    // In a real app, we would verify against the sent code
    if (token.length === 6 && /^\d+$/.test(token)) {
      return { verified: true };
    }

    throw new UnauthorizedException('Invalid token');
  }
}