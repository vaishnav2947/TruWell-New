// backend/src/pharmacy/dto/pharmacy-search.dto.ts
import { IsOptional, IsString, IsInt, Min } from 'class-validator';

export class PharmacySearchDto {
  @IsOptional()
  @IsString()
  postcode?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  odsCode?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number = 10;
}