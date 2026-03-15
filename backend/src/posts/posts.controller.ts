import { Controller, Get, Post, Body, Param, Patch, UseGuards, Query, NotFoundException, Header } from '@nestjs/common';
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
    @Roles('ADMIN')
    create(@Body() createPostDto: CreatePostDto, @GetUser('id') userId: string) {
        return this.postsService.create(createPostDto, userId);
    }

    @Public()
    @Get()
    findAll() {
        return this.postsService.findAll();
    }

    // 🌟 MAGIC SHARE LINK API (Pure NestJS Way - Crash Free)
    @Public()
    @Get(':id/share')
    @Header('Content-Type', 'text/html') // 🌟 NestJS কে বলে দিচ্ছি যে আমরা HTML পাঠাবো
    async getShareableLink(@Param('id') id: string, @Query('redirect') redirectUrl: string) {
        try {
            const post = await this.postsService.findOne(id);

            const mediaArr = Array.isArray(post.media) ? post.media : [];
            const firstImage = mediaArr.find((m: any) => m.type === 'IMAGE');
            const imageUrl = firstImage ? (firstImage as any).url : 'https://placehold.co/800x400/10b981/ffffff?text=CRC+Community+Update';

            const title = post.title || 'CRC Community Update';
            const description = post.content.substring(0, 150) + '...';

            // 🌟 সরাসরি HTML স্ট্রিং রিটার্ন করছি
            return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${title}</title>
                
                <meta property="og:type" content="article">
                <meta property="og:title" content="${title}">
                <meta property="og:description" content="${description}">
                <meta property="og:image" content="${imageUrl}">
                <meta property="og:url" content="${redirectUrl || '#'}">

                <meta name="twitter:card" content="summary_large_image">
                <meta name="twitter:title" content="${title}">
                <meta name="twitter:description" content="${description}">
                <meta name="twitter:image" content="${imageUrl}">

                <meta http-equiv="refresh" content="0;url=${redirectUrl || '/'}">
                <script>
                    window.location.href = "${redirectUrl || '/'}";
                </script>
            </head>
            <body>
                <p>Redirecting you to the post...</p>
            </body>
            </html>
            `;
        } catch (error) {
            // 🌟 পোস্ট না পেলে 404 এরর থ্রো করবে
            throw new NotFoundException('Post not found');
        }
    }

    @Public()
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.postsService.findOne(id);
    }

    @Public()
    @Patch(':id/like')
    likePost(@Param('id') id: string) {
        return this.postsService.incrementLike(id);
    }
}