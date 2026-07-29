// backend/src/pharmacy/pharmacy.controller.ts
import { Controller, Get, Query, Param } from '@nestjs/common';
import { PharmacyService } from './pharmacy.service';
import { PharmacySearchDto } from './dto/pharmacy-search.dto';

@Controller('pharmacy')
export class PharmacyController {
  constructor(private readonly pharmacyService: PharmacyService) {}

  @Get('search')
  searchPharmacies(@Query() pharmacySearchDto: PharmacySearchDto) {
    return this.pharmacyService.searchPharmacies(pharmacySearchDto);
  }

  @Get(':id')
  getPharmacyById(@Param('id') id: string) {
    return this.pharmacyService.getPharmacyById(id);
  }
}