import { PrismaService } from '../prisma/prisma.service';
import { CreateSignatureDto } from './dto/create-signature.dto';
export declare class SignatureService {
    private prisma;
    constructor(prisma: PrismaService);
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
