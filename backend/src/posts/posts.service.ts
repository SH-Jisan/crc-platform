import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreatePostDto, userId: string) {
    // 🌟 Transaction ব্যবহার করছি যাতে পোস্ট এবং গ্যালারি দুটোই একসাথে সেভ হয়
    return this.prisma.$transaction(async (prisma) => {
      // ১. আগে পোস্ট তৈরি করা
      const post = await prisma.post.create({
        data: {
          post_type: data.post_type || 'UPDATE',
          title: data.title,
          content: data.content,
          media_url: data.media_url,
          media_type: data.media_type,
          is_gallery_synced: data.is_gallery_synced || false,
          author_id: userId,
        }
      });

      // ২. 🌟 Smart Gallery Sync Logic
      // যদি ইউজার গ্যালারিতে সিঙ্ক করতে চায় এবং সেটি যদি কোনো ছবি হয়!
      if (data.is_gallery_synced && data.media_url && data.media_type === 'IMAGE') {
        await prisma.gallery.create({
          data: {
            image_url: data.media_url,
            caption: data.title || 'Community Update', // টাইটেল না থাকলে ডিফল্ট ক্যাপশন
            uploaded_by: userId,
          }
        });
      }

      return post;
    });
  }

  async findAll() {
    // সব পোস্ট নিয়ে আসবো এবং সাথে লেখকের নাম ও ছবিও আনবো
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

  // 🌟 এঙ্গেজমেন্ট: লাইক/ক্ল্যাপ বাড়ানো
  async incrementLike(id: string) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) throw new NotFoundException('Post not found');

    return this.prisma.post.update({
      where: { id },
      data: { likes_count: { increment: 1 } }
    });
  }
}