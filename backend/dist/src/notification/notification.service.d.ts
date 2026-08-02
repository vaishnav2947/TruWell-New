import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
export declare class NotificationService {
    private prisma;
    constructor(prisma: PrismaService);
    createNotification(createNotificationDto: CreateNotificationDto): Promise<{
        id: string;
        createdAt: Date;
        prescriptionId: string | null;
        userId: string;
        type: string;
        title: string;
        body: string;
        relatedId: string | null;
        relatedType: string | null;
        isRead: boolean;
    }>;
}
