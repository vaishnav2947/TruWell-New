import { TrackingService } from './tracking.service';
export declare class TrackingController {
    private readonly trackingService;
    constructor(trackingService: TrackingService);
    getTracking(prescriptionId: string): Promise<{
        id: string;
        updatedAt: Date;
        status: string;
        prescriptionId: string;
        trackingInfo: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    updateTracking(body: {
        prescriptionId: string;
        status: string;
        details?: any;
    }): Promise<{
        id: string;
        updatedAt: Date;
        status: string;
        prescriptionId: string;
        trackingInfo: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
}
