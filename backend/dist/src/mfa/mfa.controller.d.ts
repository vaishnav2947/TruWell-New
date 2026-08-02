import { MfaService } from './mfa.service';
import { MfaVerifyDto } from './dto/mfa-verify.dto';
export declare class MfaController {
    private readonly mfaService;
    constructor(mfaService: MfaService);
    initiateMfa(body: {
        userId: string;
        method: 'email' | 'sms' | 'authenticator';
    }): Promise<{
        method: "authenticator";
        secret: string;
        message?: undefined;
    } | {
        method: "email" | "sms";
        message: string;
        secret?: undefined;
    }>;
    verifyMfa(mfaVerifyDto: MfaVerifyDto): Promise<{
        verified: boolean;
    }>;
}
