import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { AuthGuard } from 'src/auth/auth.guard'; // পাথ চেক করে নিবেন

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
    getAll(){
        return this.galleryService.getAll();
    }
}