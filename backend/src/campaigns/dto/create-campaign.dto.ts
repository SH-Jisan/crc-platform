import { IsString, IsNumber, IsOptional } from "class-validator";

export class CreateCampaignDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  goal_amount: number;

  @IsOptional()
  @IsString()
  meta_title?: string;

  @IsOptional()
  @IsString()
  meta_description?: string;
}