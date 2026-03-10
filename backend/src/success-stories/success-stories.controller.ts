import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { SuccessStoriesService } from './success-stories.service';

@Controller('success-stories')
export class SuccessStoriesController {
    constructor(private readonly successStoriesService: SuccessStoriesService) {}

    @Post()
    create(@Body() createSuccessStoryDto: any) {
        // Note: Industry standard e ekhane DTO validation add korte hoy, amra pore add korbo
        return this.successStoriesService.create(createSuccessStoryDto);
    }

    @Get()
    findAll() {
        return this.successStoriesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.successStoriesService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateSuccessStoryDto: any) {
        return this.successStoriesService.update(id, updateSuccessStoryDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.successStoriesService.remove(id);
    }
}