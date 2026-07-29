// backend/src/signature/signature.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSignatureDto } from './dto/create-signature.dto';

@Injectable()
export class SignatureService {
  constructor(private prisma: PrismaService) {}

  async createSignature(createSignatureDto: CreateSignatureDto) {
    const { prescriptionId, signatureData, pharmacistName, gphcNumber, reason } = createSignatureDto;

    // Check if prescription exists and is in correct state
    const prescription = await this.prisma.prescription.findUnique({
      where: { id: prescriptionId },
    });

    if (!prescription) {
      throw new BadRequestException('Prescription not found');
    }

    // Check if prescription is in a state that allows signing (e.g., locked or ready_for_signature)
    // Assuming we have a status field on prescription
    if (prescription.status !== 'locked' && prescription.status !== 'ready_for_signature') {
      throw new BadRequestException('Prescription is not ready for signature');
    }

    // Create signature record
    const signature = await this.prisma.digitalSignature.create({
      data: {
        prescriptionId,
        signatureData, // This would be the image data or URL
        pharmacistName,
        gphcNumber,
        signedAt: new Date(),
        reason,
      },
    });

    // Update prescription status to signed
    await this.prisma.prescription.update({
      where: { id: prescriptionId },
      data: { status: 'signed' },
    });

    return signature;
  }

  // Additional methods as needed
}