// backend/src/delivery-tracking/tracking.controller.ts
import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { TrackingService } from './tracking.service';

@Controller('delivery')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Get(':id')
  getTracking(@Param('id') prescriptionId: string) {
    return this.trackingService.getTrackingByPrescriptionId(prescriptionId);
  }

  @Post('update')
  async updateTracking(@Body() body: { prescriptionId: string; status: string; details?: any }) {
    const { prescriptionId, status, details } = body;
    return this.trackingService.updateTrackingStatus(prescriptionId, status, details);
  }
}