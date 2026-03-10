import { IsString } from 'class-validator';

export class CreateAnnouncementDto {
    @IsString()
    title: string;

    @IsString()
    message: string;

    @IsString()
    created_by: string;
}