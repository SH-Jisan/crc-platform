import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginationQueryDto } from "../common/dto/pagination-query.dto";
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';
import { GetUser } from '../common/decorators/get-user.decorator';

@Controller('posts')
@UseGuards(AuthGuard, RolesGuard)
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Post()
    @Roles('ADMIN', 'MEMBER')
    create(@Body() createPostDto: CreatePostDto, @GetUser('id') userId: string) { // 🔥 Query থেকে বাদ দিয়ে GetUser(টোকেন) থেকে আনা হলো
        return this.postsService.create(createPostDto, userId);
    }

    @Public()
    @Get()
    getAll(@Query() paginationQuery: PaginationQueryDto)  {
        const { page, limit } = paginationQuery;
        return this.postsService.getAll(page, limit);
    }

    @Public()
    @Get(':id')
    getPostById(@Param('id') id: string) {
        return this.postsService.getPostById(id);
    }

    @Patch(':id')
    @Roles('ADMIN', 'MEMBER')
    updatePost(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
        return this.postsService.updatePost(id, updatePostDto);
    }

    @Delete(':id')
    @Roles('ADMIN')
    deletePost(@Param('id') id: string) {
        return this.postsService.deletePost(id);
    }
}