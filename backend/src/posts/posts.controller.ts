import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Post()
    create(@Body() createPostDto: CreatePostDto, @Query('userId') userId: string) {
        return this.postsService.create(createPostDto, userId);
    }

    @Get()
    getAll() {
        return this.postsService.getAll();
    }
}