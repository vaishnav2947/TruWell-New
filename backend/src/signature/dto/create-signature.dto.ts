// backend/src/signature/dto/create-signature.dto.ts
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateSignatureDto {
  @IsNotEmpty()
  prescriptionId: string;

  @IsNotEmpty()
  signatureData: string; // Base64 string or URL

  @IsNotEmpty()
  pharmacistName: string;

  @IsNotEmpty()
  gphcNumber: string;

  @IsOptional()
  reason?: string;
}