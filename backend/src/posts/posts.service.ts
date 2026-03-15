import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreatePostDto, userId: string) {
    return this.prisma.$transaction(async (prisma) => {
      const post = await prisma.post.create({
        data: {
          post_type: data.post_type || 'UPDATE',
          title: data.title,
          content: data.content,
          // 🌟 THE FIX: null এর বদলে undefined দেওয়া হয়েছে
          media: data.media && data.media.length > 0 ? data.media : undefined,
          is_gallery_synced: data.is_gallery_synced || false,
          author_id: userId,
        }
      });

      // 🌟 Smart Gallery Sync (একাধিক ছবির জন্য)
      if (data.is_gallery_synced && data.media && data.media.length > 0) {
        // শুধুমাত্র 'IMAGE' টাইপের মিডিয়াগুলো ফিল্টার করে বের করছি
        const imageMedia = data.media.filter((m: any) => m.type === 'IMAGE');

        if (imageMedia.length > 0) {
          const galleryData = imageMedia.map(img => ({
            image_url: img.url,
            caption: data.title || 'Community Update',
            uploaded_by: userId,
          }));

          // সবগুলো ছবি একসাথে গ্যালারিতে সেভ করছি
          await prisma.gallery.createMany({
            data: galleryData,
          });
        }
      }

      return post;
    });
  }

  async findAll() {
    return this.prisma.post.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        author: {
          select: {
            full_name: true,
            avatar_url: true,
          }
        }
      }
    });
  }
  // 🌟 সিঙ্গেল পোস্ট খোঁজার ফাংশন
  async findOne(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            full_name: true,
            avatar_url: true,
          }
        }
      }
    });

    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async incrementLike(id: string) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) throw new NotFoundException('Post not found');

    return this.prisma.post.update({
      where: { id },
      data: { likes_count: { increment: 1 } }
    });
  }
}