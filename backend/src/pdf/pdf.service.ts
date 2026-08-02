// backend/src/pdf/pdf.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { generatePdf } from './pdf-generator';

@Injectable()
export class PdfService {
  constructor(private prisma: PrismaService) {}

  async generatePdf(prescriptionId: string) {
    // Fetch prescription with related data
    const prescription = await this.prisma.prescription.findUnique({
      where: { id: prescriptionId },
      include: {
        patient: true,
        medicine: true,
      },
    });

    if (!prescription) {
      throw new BadRequestException('Prescription not found');
    }

    if (prescription.status !== 'signed') {
      throw new BadRequestException('Prescription must be signed before generating PDF');
    }

    // Generate PDF buffer
    const pdfBuffer = await generatePdf(prescription);

    // Save PDF metadata
    const pdfMetadata = await this.prisma.pDFMetadata.create({
      data: {
        prescriptionId,
        fileUrl: `/pdf/download/${prescription.prescriptionNumber}.pdf`,
        volume: 1,
        generatedAt: new Date(),
      },
    });

    return {
      pdfId: pdfMetadata.id,
      downloadUrl: pdfMetadata.fileUrl,
    };
  }
}