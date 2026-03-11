import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class UploadGalleryDto {
    @IsString()
    @IsNotEmpty()
    image_url: string;

    @IsOptional()
    @IsString()
    caption?: string;
}
