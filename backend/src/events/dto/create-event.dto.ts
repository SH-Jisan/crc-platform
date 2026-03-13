import {IsString, IsDateString, IsOptional, IsNumber, IsBoolean} from "class-validator"

export class CreateEventDto{

    @IsString()
    title:string

    @IsString()
    description:string

    @IsString()
    location:string

    @IsDateString()
    event_date:string

    @IsOptional()
    @IsString()
    meta_title?: string

    @IsOptional()
    @IsString()
    meta_description?: string

    @IsBoolean()
    @IsOptional()
    is_donation_enabled?: boolean;

    @IsNumber()
    @IsOptional()
    goal_amount?: number;
}