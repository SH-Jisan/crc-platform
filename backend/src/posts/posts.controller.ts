import { Controller, Get, Post, Body, Param, Patch, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { GetUser } from '../common/decorators/get-user.decorator';
import { Public } from '../common/decorators/public.decorator';

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Post()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('ADMIN') // 🌟 শুধুমাত্র অ্যাডমিনরাই পোস্ট করতে পারবে
    create(@Body() createPostDto: CreatePostDto, @GetUser('id') userId: string) {
        return this.postsService.create(createPostDto, userId);
    }

    @Public() // 🌟 সবাই নিউজফিড দেখতে পারবে
    @Get()
    findAll() {
        return this.postsService.findAll();
    }

    @Public() // 🌟 সবাই লাইক/ক্ল্যাপ দিতে পারবে
    @Patch(':id/like')
    likePost(@Param('id') id: string) {
        return this.postsService.incrementLike(id);
    }
}