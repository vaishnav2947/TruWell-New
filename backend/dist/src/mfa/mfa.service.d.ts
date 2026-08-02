import { PrismaService } from '../prisma/prisma.service';
import { MfaVerifyDto } from './dto/mfa-verify.dto';
export declare class MfaService {
    private prisma;
    constructor(prisma: PrismaService);
    initiateMfa(userId: string, method: 'email' | 'sms' | 'authenticator'): Promise<{
        method: "authenticator";
        secret: string;
        message?: undefined;
    } | {
        method: "email" | "sms";
        message: string;
        secret?: undefined;
    }>;
    verifyMfa(userId: string, dto: MfaVerifyDto): Promise<{
        verified: boolean;
    }>;
}
