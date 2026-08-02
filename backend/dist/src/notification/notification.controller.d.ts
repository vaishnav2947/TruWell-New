import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
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
