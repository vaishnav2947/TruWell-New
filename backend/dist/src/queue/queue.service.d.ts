import { Queue } from 'bull';
export declare class QueueService {
    private readonly emailQueue;
    constructor(emailQueue: Queue);
    addEmailJob(data: any): Promise<import("bull").Job<any>>;
    retryFailedJobs(): Promise<{
        message: string;
    }>;
}
