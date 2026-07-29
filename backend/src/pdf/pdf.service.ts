// backend/src/pdf/pdf.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { generatePdf } from './pdf-generator'; // We'll assume we have a PDF generation function
import { createPdfMetadata } from './pdf-metadata'; // Helper to create metadata

@Injectable()
export class PdfService {
  constructor(private prisma: PrismaService) {}

  async generatePdf(prescriptionId: string) {
    // Fetch prescription with related data
    const prescription = await this.prisma.prescription.findUnique({
      where: { id: prescriptionId },
      include: {
        patient: true,
        medication: true,
        // Include other relations as needed
      },
    });

    if (!prescription) {
      throw new BadRequestException('Prescription not found');
    }

    // Check if prescription is signed (or in a state that allows PDF generation)
    if (prescription.status !== 'signed') {
      throw new BadRequestException('Prescription must be signed before generating PDF');
    }

    // Generate PDF buffer
    const pdfBuffer = await generatePdf(prescription);

    // Save PDF metadata
    const pdfMetadata = await this.prisma.pDFMetadata.create({
      data: {
        prescriptionId,
        fileName: `prescription_${prescription.prescriptionNumber}.pdf`,
        size: pdfBuffer.length,
        generatedAt: new Date(),
        // Store the file in a storage service (e.g., AWS S3) and save the URL
        // For simplicity, we'll store the buffer as base64 or a path
        // In a real app, you would upload to storage and save the URL
        // We'll store as base64 for this example, but note: not efficient for large files
        data: pdfBuffer.toString('base64'),
      },
    });

    return {
      pdfId: pdfMetadata.id,
      // In a real app, return a URL to download the PDF
      downloadUrl: `/pdf/download/${pdfMetadata.id}`,
    };
  }

  // Additional methods to get PDF, etc.
}