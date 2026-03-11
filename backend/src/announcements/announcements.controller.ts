import {Controller, Get, Post, Body, Param, Patch, Delete, Query, UseGuards, Req} from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { CursorPaginationDto } from "../common/dto/cursor-pagination.dto"; 
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';

@Controller('announcements')
@UseGuards(AuthGuard, RolesGuard)
export class AnnouncementsController {
    constructor(private readonly announcementsService: AnnouncementsService) {}

    @Post()
    @Roles('ADMIN', 'MEMBER')
    create(@Body() createAnnouncementDto: CreateAnnouncementDto, @Req() req) {
        const userId = req.user.id || req.user.sub;
        return this.announcementsService.create({
            title: createAnnouncementDto.title,
            message: createAnnouncementDto.message,
            created_by: userId
        });
    }

    @Get()
    @Public()
    findAll(@Query() query: CursorPaginationDto) {
        return this.announcementsService.findAll(query.limit, query.cursor);
    }

    @Get(':id')
    @Public()
    findOne(@Param('id') id: string) {
        return this.announcementsService.findOne(id);
    }

    @Patch(':id')
    @Roles('ADMIN', 'MEMBER')
    update(@Param('id') id: string, @Body() updateAnnouncementDto: UpdateAnnouncementDto) {
        return this.announcementsService.update(id, updateAnnouncementDto);
    }

    @Delete(':id')
    @Roles('ADMIN')
    remove(@Param('id') id: string) {
        return this.announcementsService.remove(id);
    }
}