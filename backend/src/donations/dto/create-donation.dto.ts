import { IsString, IsNumber, IsOptional, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateDonationDto {
  @IsUUID()
  @IsNotEmpty()
  campaign_id: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  method: string;

  @IsOptional()
  @IsString()
  transaction_id?: string;
}