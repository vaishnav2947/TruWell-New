import { SignatureService } from './signature.service';
import { CreateSignatureDto } from './dto/create-signature.dto';
export declare class SignatureController {
    private readonly signatureService;
    constructor(signatureService: SignatureService);
    createSignature(createSignatureDto: CreateSignatureDto): Promise<{
        id: string;
        prescriptionId: string;
        signatureData: string;
        gphcNumber: string | null;
        reason: string | null;
        signedBy: string;
        signedAt: Date;
        ipAddress: string | null;
        userAgent: string | null;
        fullName: string | null;
    }>;
}
