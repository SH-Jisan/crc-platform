import { IsString, IsOptional } from 'class-validator';

export class CreatePostDto {
    @IsString()
    title: string;

    @IsString()
    content: string;

    @IsOptional()
    @IsString()
    status?: string;

    @IsOptional()
    @IsString()
    meta_title?: string;

    @IsOptional()
    @IsString()
    meta_description?: string;
}