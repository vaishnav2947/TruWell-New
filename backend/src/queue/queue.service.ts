// backend/src/queue/queue.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue('email') private readonly emailQueue: Queue,
  ) {}

  async addEmailJob(data: any) {
    return this.emailQueue.add('send-email', data);
  }

  async retryFailedJobs() {
    // Implementation for retrying failed jobs
    const failed = await this.emailQueue.getFailed();
    for (const job of failed) {
      await job.retry();
    }
    return { message: 'Retried failed jobs' };
  }
}