// backend/src/email/email.controller.ts
import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { EmailService } from './email.service';
import { CreateEmailDto } from './dto/create-email.dto';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  @UsePipes(new ValidationPipe())
  async sendEmail(@Body() createEmailDto: CreateEmailDto) {
    return this.emailService.sendEmail(createEmailDto);
  }

  @Post('preview')
  @UsePipes(new ValidationPipe())
  async previewEmail(@Body() createEmailDto: CreateEmailDto) {
    return this.emailService.previewEmail(createEmailDto);
  }
}