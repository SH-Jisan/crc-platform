import {Controller, Get, Post, Body, Param, Patch, Delete, Query} from '@nestjs/common';
import { SuccessStoriesService } from './success-stories.service';
import { CreateSuccessStoryDto } from './dto/create-success-story.dto';
import { UpdateSuccessStoryDto } from "./dto/update-success-story.dto";
import {CursorPaginationDto} from "../common/dto/cursor-pagination.dto";

@Controller('success-stories')
export class SuccessStoriesController {
    constructor(private readonly successStoriesService: SuccessStoriesService) {}

    @Post()
    create(@Body() createSuccessStoryDto: CreateSuccessStoryDto) {
        // Note: Industry standard e ekhane DTO validation add korte hoy, amra pore add korbo
        return this.successStoriesService.create(createSuccessStoryDto);
    }

    @Get()
    findAll(@Query() query: CursorPaginationDto) {
        return this.successStoriesService.findAll(query.limit, query.cursor);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.successStoriesService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateSuccessStoryDto: UpdateSuccessStoryDto) {
        return this.successStoriesService.update(id, updateSuccessStoryDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.successStoriesService.remove(id);
    }
}