import { IsString, IsNumber, IsOptional, IsNotEmpty, IsEnum, IsUUID, IsBoolean } from 'class-validator';
import { DonationType } from '@prisma/client';

export class CreateDonationDto {
  @IsEnum(DonationType)
  @IsNotEmpty()
  donation_type: DonationType; // 🌟 CLUB, CAMPAIGN, EVENT, CUSTOM

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  method: string;

  @IsOptional()
  @IsString()
  transaction_id?: string;

  // 🌟 Optional IDs (যেটার ডোনেশন, শুধু সেটার ID আসবে)
  @IsOptional()
  @IsUUID()
  campaign_id?: string;

  @IsOptional()
  @IsUUID()
  event_id?: string;

  @IsOptional()
  @IsUUID()
  custom_cause_id?: string;

  // 🌟 Guest Donation Info
  @IsOptional()
  @IsBoolean()
  is_anonymous?: boolean;

  @IsOptional()
  @IsString()
  donor_name?: string;

  @IsOptional()
  @IsString()
  donor_email?: string;

  @IsOptional()
  @IsString()
  donor_phone?: string;
}