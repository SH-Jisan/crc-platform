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

  async findAll(page: number = 1, limit: number = 10, clientIp?: string) {
    const safeLimit = Math.min(Math.max(1, Number(limit) || 10), 100);
    const safePage = Math.max(1, Number(page) || 1);
    const skip = (safePage - 1) * safeLimit;

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        skip,
        take: safeLimit,
        orderBy: { created_at: 'desc' },
        include: {
          author: {
            select: {
              full_name: true,
              avatar_url: true,
            }
          },
          likes: clientIp ? {
            where: { ip_address: clientIp }
          } : false
        }
      }),
      this.prisma.post.count(),
    ]);

    const formattedData = posts.map(post => {
      const { likes, ...rest } = post as any;
      return {
        ...rest,
        has_liked: Array.isArray(likes) && likes.length > 0,
      };
    });

    return {
      data: formattedData,
      meta: {
        total,
        page: safePage,
        limit: safeLimit,
        totalPages: Math.ceil(total / safeLimit),
      }
    };
  }

  // 🌟 সিঙ্গেল পোস্ট খোঁজার ফাংশন
  async findOne(id: string, clientIp?: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            full_name: true,
            avatar_url: true,
          }
        },
        likes: clientIp ? {
          where: { ip_address: clientIp }
        } : false
      }
    });

    if (!post) throw new NotFoundException('Post not found');

    const { likes, ...rest } = post as any;
    return {
      ...rest,
      has_liked: Array.isArray(likes) && likes.length > 0,
    };
  }

  // 🌟 IP-based Toggle Like Logic (1 IP can only like once until unliked/disliked)
  async toggleLike(id: string, ipAddress: string) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) throw new NotFoundException('Post not found');

    const existingLike = await this.prisma.postLike.findUnique({
      where: {
        post_id_ip_address: {
          post_id: id,
          ip_address: ipAddress,
        },
      },
    });

    if (existingLike) {
      // 🌟 Already liked by this IP -> Dislike (Unlike)
      await this.prisma.$transaction([
        this.prisma.postLike.delete({
          where: { id: existingLike.id },
        }),
        this.prisma.post.update({
          where: { id },
          data: { likes_count: { decrement: 1 } },
        }),
      ]);

      const updatedPost = await this.prisma.post.findUnique({ where: { id } });
      const currentLikes = Math.max(0, updatedPost?.likes_count || 0);

      return {
        liked: false,
        likes_count: currentLikes,
      };
    } else {
      // 🌟 Not liked by this IP -> Like
      await this.prisma.$transaction([
        this.prisma.postLike.create({
          data: {
            post_id: id,
            ip_address: ipAddress,
          },
        }),
        this.prisma.post.update({
          where: { id },
          data: { likes_count: { increment: 1 } },
        }),
      ]);

      const updatedPost = await this.prisma.post.findUnique({ where: { id } });
      return {
        liked: true,
        likes_count: updatedPost?.likes_count || 0,
      };
    }
  }
}