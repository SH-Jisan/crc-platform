import { IsString, IsNumber } from "class-validator";

export class CreateCampaignDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  goal_amount: number;
}
