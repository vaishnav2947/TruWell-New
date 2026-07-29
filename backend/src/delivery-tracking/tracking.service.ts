// backend/src/delivery-tracking/tracking.service.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TrackingService {
  constructor(private prisma: PrismaService) {}

  async updateTrackingStatus(prescriptionId: string, status: string, details?: any) {
    const prescription = await this.prisma.prescription.findUnique({
      where: { id: prescriptionId },
    });

    if (!prescription) {
      throw new NotFoundException('Prescription not found');
    }

    // Update or create delivery status
    const tracking = await this.prisma.deliveryStatus.upsert({
      where: { prescriptionId },
      update: {
        status,
        updatedAt: new Date(),
        ...(details && { trackingInfo: { ...(await this.prisma.deliveryStatus.findUnique({ where: { prescriptionId } })?.trackingInfo || {}), ...details } }),
      },
      create: {
        prescriptionId,
        status,
        updatedAt: new Date(),
        ...(details && { trackingInfo: details }),
      },
    });

    return tracking;
  }

  async getTrackingByPrescriptionId(prescriptionId: string) {
    const tracking = await this.prisma.deliveryStatus.findUnique({
      where: { prescriptionId },
    });

    if (!tracking) {
      throw new NotFoundException('Tracking information not found for this prescription');
    }

    return tracking;
  }
}