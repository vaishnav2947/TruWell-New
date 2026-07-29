// backend/src/mfa/mfa.controller.ts
import { Controller, Post, Body, UsePipes, ValidationPipe, Get, Query } from '@nestjs/common';
import { MfaService } from './mfa.service';
import { MfaVerifyDto } from './dto/mfa-verify.dto';

@Controller('mfa')
export class MfaController {
  constructor(private readonly mfaService: MfaService) {}

  @Post('initiate')
  async initiateMfa(@Body() body: { userId: string; method: 'email' | 'sms' | 'authenticator' }) {
    const { userId, method } = body;
    return this.mfaService.initiateMfa(userId, method);
  }

  @Post('verify')
  @UsePipes(new ValidationPipe())
  async verifyMfa(@Body() mfaVerifyDto: MfaVerifyDto) {
    const { userId, token, method, secret } = mfaVerifyDto;
    return this.mfaService.verifyMfa(userId, {
      token,
      method,
      secret
    });
  }
}