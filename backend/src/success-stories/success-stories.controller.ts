import {Controller, Get, Post, Body, Param, Patch, Delete, Query, UseGuards, Req} from '@nestjs/common';
import { SuccessStoriesService } from './success-stories.service';
import { CreateSuccessStoryDto } from './dto/create-success-story.dto';
import { UpdateSuccessStoryDto } from "./dto/update-success-story.dto";
import { CursorPaginationDto } from "../common/dto/cursor-pagination.dto";
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';

@Controller('success-stories')
@UseGuards(AuthGuard, RolesGuard)
export class SuccessStoriesController {
    constructor(private readonly successStoriesService: SuccessStoriesService) {}

    @Post()
    @Roles('ADMIN', 'MEMBER')
    create(@Body() createSuccessStoryDto: CreateSuccessStoryDto, @Req() req) {
        const userId = req.user.id || req.user.sub;
        return this.successStoriesService.create({
            title: createSuccessStoryDto.title,
            content: createSuccessStoryDto.content,
            image_url: createSuccessStoryDto.image_url,
            meta_title: (createSuccessStoryDto as any).meta_title,
            meta_description: (createSuccessStoryDto as any).meta_description,
            author_id: userId
        });
    }

    @Get()
    @Public()
    findAll(@Query() query: CursorPaginationDto) {
        return this.successStoriesService.findAll(query.limit, query.cursor);
    }

    @Get(':id')
    @Public()
    findOne(@Param('id') id: string) {
        return this.successStoriesService.findOne(id);
    }

    @Patch(':id')
    @Roles('ADMIN', 'MEMBER')
    update(@Param('id') id: string, @Body() updateSuccessStoryDto: UpdateSuccessStoryDto) {
        return this.successStoriesService.update(id, updateSuccessStoryDto);
    }

    @Delete(':id')
    @Roles('ADMIN')
    remove(@Param('id') id: string) {
        return this.successStoriesService.remove(id);
    }
}