import { IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';

export class CreateCampaignDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  goal_amount: number;

  @IsOptional()
  @IsDateString()
  start_date?: string;

  @IsOptional()
  @IsDateString()
  end_date?: string;

  @IsOptional()
  @IsString()
  meta_title?: string;

  @IsOptional()
  @IsString()
  meta_description?: string;
}