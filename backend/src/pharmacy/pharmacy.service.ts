// backend/src/pharmacy/pharmacy.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PharmacySearchDto } from './dto/pharmacy-search.dto';

@Injectable()
export class PharmacyService {
  constructor(private prisma: PrismaService) {}

  async searchPharmacies(searchDto: PharmacySearchDto) {
    const { postcode, name, odsCode, page = 1, limit = 10 } = searchDto;

    const where: any = {};

    if (postcode) {
      where.postcode = { contains: postcode, mode: 'insensitive' };
    }
    if (name) {
      where.name = { contains: name, mode: 'insensitive' };
    }
    if (odsCode) {
      where.odsCode = { equals: odsCode };
    }

    // Add filters for services if needed
    // For example, if we want to filter by whether they support private prescriptions
    // We would have a boolean field like `supportsPrivatePrescriptions`

    const skip = (page - 1) * limit;

    const [pharmacies, total] = await Promise.all([
      this.prisma.pharmacy.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      this.prisma.pharmacy.count({ where }),
    ]);

    return {
      data: pharmacies,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getPharmacyById(id: string) {
    const pharmacy = await this.prisma.pharmacy.findUnique({
      where: { id },
    });

    if (!pharmacy) {
      throw new NotFoundException('Pharmacy not found');
    }

    return pharmacy;
  }
}