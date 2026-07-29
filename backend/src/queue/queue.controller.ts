// backend/src/queue/queue.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { QueueService } from './queue.service';

@Controller('queue')
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @Post('retry')
  async retryFailedJobs() {
    return this.queueService.retryFailedJobs();
  }
}