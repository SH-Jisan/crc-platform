import {Controller, Post, Body, Get, Req, UseGuards, Query} from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { AuthGuard } from 'src/auth/auth.guard';
import {CursorPaginationDto} from "../common/dto/cursor-pagination.dto"; // পাথ চেক করে নিবেন

@Controller('api/v1/gallery')
export class GalleryController {

    constructor(private galleryService: GalleryService){}

    @UseGuards(AuthGuard)
    @Post()
    upload(@Body() body, @Req() req){
        return this.galleryService.upload(
            body.image_url,
            body.caption,
            req.user.id
        );
    }

    @Get()
    findAll(@Query() query: CursorPaginationDto) {
        return this.galleryService.findAll(query.limit, query.cursor);
    }
}