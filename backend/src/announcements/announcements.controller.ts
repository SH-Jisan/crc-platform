import {Controller, Get, Post, Body, Param, Patch, Delete, Query} from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import {CursorPaginationDto} from "../common/dto/cursor-pagination.dto"; // 🔥 Notun import
@Controller('announcements')
export class AnnouncementsController {
    constructor(private readonly announcementsService: AnnouncementsService) {}

    @Post()
    create(@Body() createAnnouncementDto: CreateAnnouncementDto) {
        return this.announcementsService.create(createAnnouncementDto);
    }

    @Get()
    findAll(@Query() query: CursorPaginationDto) {
        return this.announcementsService.findAll(query.limit, query.cursor);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.announcementsService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateAnnouncementDto: UpdateAnnouncementDto) {
        return this.announcementsService.update(id, updateAnnouncementDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.announcementsService.remove(id);
    }
}