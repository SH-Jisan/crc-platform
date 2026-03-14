import { IsString, IsNotEmpty, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { PostType } from '@prisma/client';

export class CreatePostDto {
    @IsEnum(PostType)
    @IsOptional()
    post_type?: PostType;

    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsString()
    @IsOptional()
    media_url?: string;

    @IsString()
    @IsOptional()
    media_type?: string; // 'IMAGE' or 'VIDEO'

    @IsBoolean()
    @IsOptional()
    is_gallery_synced?: boolean;
}