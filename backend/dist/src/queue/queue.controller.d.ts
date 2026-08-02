import { QueueService } from './queue.service';
export declare class QueueController {
    private readonly queueService;
    constructor(queueService: QueueService);
    retryFailedJobs(): Promise<{
        message: string;
    }>;
}
