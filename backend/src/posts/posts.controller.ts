import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import {PaginationQueryDto} from "../common/dto/pagination-query.dto";

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Post()
    create(@Body() createPostDto: CreatePostDto, @Query('userId') userId: string) {
        return this.postsService.create(createPostDto, userId);
    }

    @Get()
    getAll(@Query() paginationQuery: PaginationQueryDto)  {
        const { page, limit } = paginationQuery;
        return this.postsService.getAll(page, limit);
    }
}