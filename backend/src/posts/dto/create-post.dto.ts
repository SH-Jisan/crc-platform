import {IsString, IsNotEmpty, IsOptional, IsEnum, IsBoolean, IsArray} from 'class-validator';
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

    @IsArray()
    @IsOptional()
    media?: any[]; // [{ url: string, type: 'IMAGE' | 'VIDEO' }]

    @IsBoolean()
    @IsOptional()
    is_gallery_synced?: boolean;
}