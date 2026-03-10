import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';

@Controller('announcements')
export class AnnouncementsController {
    constructor(private readonly announcementsService: AnnouncementsService) {}

    @Post()
    create(@Body() createAnnouncementDto: { title: string; message: string; created_by: string }) {
        return this.announcementsService.create(createAnnouncementDto);
    }

    @Get()
    findAll() {
        return this.announcementsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.announcementsService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateAnnouncementDto: { title?: string; message?: string }) {
        return this.announcementsService.update(id, updateAnnouncementDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.announcementsService.remove(id);
    }
}