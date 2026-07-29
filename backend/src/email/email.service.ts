// backend/src/email/email.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmailDto } from './dto/create-email.dto';

@Injectable()
export class EmailService {
  constructor(private prisma: PrismaService) {}

  async sendEmail(createEmailDto: CreateEmailDto) {
    const { prescriptionId, recipient, subject, htmlBody, textBody } = createEmailDto;

    // Check prescription exists
    const prescription = await this.prisma.prescription.findUnique({
      where: { id: prescriptionId },
    });

    if (!prescription) {
      throw new BadRequestException('Prescription not found');
    }

    // Create email transmission record
    const emailTransmission = await this.prisma.emailTransmission.create({
      data: {
        prescriptionId,
        recipient,
        subject,
        htmlBody,
        textBody,
        status: 'queued',
      },
    });

    // In a real app, we would send the email via a queue (e.g., BullMQ) and update status
    // For simplicity, we'll simulate sending immediately
    // We'll update the status to sent
    await this.prisma.emailTransmission.update({
      where: { id: emailTransmission.id },
      data: {
        status: 'sent',
        sentAt: new Date(),
      },
    });

    return emailTransmission;
  }

  async previewEmail(createEmailDto: CreateEmailDto) {
    // Similar to sendEmail but without saving or sending
    // We'll return the email content that would be sent
    const { prescriptionId, recipient, subject, htmlBody, textBody } = createEmailDto;

    // We could fetch prescription to include in preview if needed
    // For now, just return the provided data
    return {
      recipient,
      subject,
      htmlBody,
      textBody,
      preview: true,
    };
  }
}