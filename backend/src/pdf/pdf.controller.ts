// backend/src/pdf/pdf.controller.ts
import { Controller, Post, Param, BadRequestException } from '@nestjs/common';
import { PdfService } from './pdf.service';

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Post(':prescriptionId')
  async generatePdf(@Param('prescriptionId') prescriptionId: string) {
    return this.pdfService.generatePdf(prescriptionId);
  }

  // Add a route to download the PDF by ID
  // @Get('download/:id')
  // async downloadPdf(@Param('id') id: string) { ... }
}