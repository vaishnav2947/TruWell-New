// backend/src/mfa/dto/mfa-verify.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class MfaVerifyDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  method: 'email' | 'sms' | 'authenticator';

  @IsString()
  @IsOptional()
  secret?: string; // For authenticator method
}