import { IsString, IsOptional } from 'class-validator';

export class CreateSuccessStoryDto {
    @IsString()
    title: string;

    @IsString()
    content: string;

    @IsOptional()
    @IsString()
    image_url?: string;

    @IsString()
    author_id: string;

    @IsOptional()
    @IsString()
    meta_title?: string;

    @IsOptional()
    @IsString()
    meta_description?: string;
}