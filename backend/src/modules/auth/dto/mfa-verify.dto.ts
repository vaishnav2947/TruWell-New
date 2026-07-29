// backend/src/modules/auth/dto/mfa-verify.dto.ts
import { IsString, Length } from 'class-validator';

export class MfaVerifyDto {
  @IsString()
  @Length(6, 6)
  token: string;
}