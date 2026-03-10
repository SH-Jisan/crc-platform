import { IsString, IsDateString, IsOptional } from "class-validator"

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

}