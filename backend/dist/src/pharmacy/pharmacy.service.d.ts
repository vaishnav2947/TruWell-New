import { PrismaService } from '../prisma/prisma.service';
import { PharmacySearchDto } from './dto/pharmacy-search.dto';
export declare class PharmacyService {
    private prisma;
    constructor(prisma: PrismaService);
    searchPharmacies(searchDto: PharmacySearchDto): Promise<{
        data: {
            id: string;
            email: string | null;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            phone: string | null;
            city: string;
            postcode: string;
            odsCode: string;
            address: string;
            country: string;
            latitude: number;
            longitude: number;
            website: string | null;
            openingHours: import("@prisma/client/runtime/library").JsonValue;
            supportsPrivatePrescriptions: boolean;
            supportsControlledDrugs: boolean;
            offersDelivery: boolean;
            isPreferred: boolean;
            isActive: boolean;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            pages: number;
        };
    }>;
    getPharmacyById(id: string): Promise<{
        id: string;
        email: string | null;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        city: string;
        postcode: string;
        odsCode: string;
        address: string;
        country: string;
        latitude: number;
        longitude: number;
        website: string | null;
        openingHours: import("@prisma/client/runtime/library").JsonValue;
        supportsPrivatePrescriptions: boolean;
        supportsControlledDrugs: boolean;
        offersDelivery: boolean;
        isPreferred: boolean;
        isActive: boolean;
    }>;
}
