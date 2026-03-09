import { IsNumber, IsString } from "class-validator";

export class CreateDonationDto {
  @IsNumber()
  amount: number;

  @IsString()
  method: string;

  @IsString()
  transaction_id: string;

  @IsString()
  campaign_id: string;
}
