import { PrismaService } from '../prisma/prisma.service';
export declare class TrackingService {
    private prisma;
    constructor(prisma: PrismaService);
    updateTrackingStatus(prescriptionId: string, status: string, details?: any): Promise<{
        id: string;
        updatedAt: Date;
        status: string;
        prescriptionId: string;
        trackingInfo: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    getTrackingByPrescriptionId(prescriptionId: string): Promise<{
        id: string;
        updatedAt: Date;
        status: string;
        prescriptionId: string;
        trackingInfo: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
}
