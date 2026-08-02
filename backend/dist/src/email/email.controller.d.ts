import { EmailService } from './email.service';
import { CreateEmailDto } from './dto/create-email.dto';
export declare class EmailController {
    private readonly emailService;
    constructor(emailService: EmailService);
    sendEmail(createEmailDto: CreateEmailDto): Promise<{
        error: string | null;
        id: string;
        status: string;
        subject: string;
        htmlBody: string;
        textBody: string | null;
        prescriptionId: string;
        recipient: string;
        attempts: number;
        lastAttempted: Date | null;
        sentAt: Date | null;
        deliveredAt: Date | null;
        openedAt: Date | null;
    }>;
    previewEmail(createEmailDto: CreateEmailDto): Promise<{
        recipient: string;
        subject: string;
        htmlBody: string;
        textBody: string | undefined;
        preview: boolean;
    }>;
}
