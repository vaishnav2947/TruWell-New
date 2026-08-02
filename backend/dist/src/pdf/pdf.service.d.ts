import { PrismaService } from '../prisma/prisma.service';
export declare class PdfService {
    private prisma;
    constructor(prisma: PrismaService);
    generatePdf(prescriptionId: string): Promise<{
        pdfId: string;
        downloadUrl: string;
    }>;
}
