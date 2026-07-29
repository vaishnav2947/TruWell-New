// backend/src/signature/signature.controller.ts
import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { SignatureService } from './signature.service';
import { CreateSignatureDto } from './dto/create-signature.dto';

@Controller('signature')
export class SignatureController {
  constructor(private readonly signatureService: SignatureService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async createSignature(@Body() createSignatureDto: CreateSignatureDto) {
    return this.signatureService.createSignature(createSignatureDto);
  }
}