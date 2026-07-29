// backend/src/email/dto/create-email.dto.ts
import { IsString, IsOptional } from 'class-validator';

export class CreateEmailDto {
  @IsString()
  prescriptionId: string;

  @IsString()
  recipient: string;

  @IsString()
  subject: string;

  @IsString()
  htmlBody: string;

  @IsOptional()
  @IsString()
  textBody?: string;
}