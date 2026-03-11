import {Controller, Post, Body, Get, Req, UseGuards, Query} from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { AuthGuard } from '../auth/auth.guard';
import { CursorPaginationDto } from '../common/dto/cursor-pagination.dto'; 
import { UploadGalleryDto } from './dto/upload-gallery.dto';

@Controller('gallery')
export class GalleryController {

    constructor(private galleryService: GalleryService){}

    @UseGuards(AuthGuard)
    @Post()
    upload(@Body() uploadGalleryDto: UploadGalleryDto, @Req() req){
        const userId = req.user.id || req.user.sub;
        return this.galleryService.upload(
            uploadGalleryDto.image_url,
            uploadGalleryDto.caption || '',
            userId
        );
    }

    @Get()
    findAll(@Query() query: CursorPaginationDto) {
        return this.galleryService.findAll(query.limit, query.cursor);
    }
}