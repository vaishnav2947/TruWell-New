// backend/src/signature/signature.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SignatureService } from './signature.service';
import { SignatureController } from './signature.controller';

@Module({
  imports: [PrismaModule],
  providers: [SignatureService],
  controllers: [SignatureController],
})
export class SignatureModule {}