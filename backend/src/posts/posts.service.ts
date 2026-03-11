import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  create(data: any, userId: string) {
    return this.prisma.post.create({
      data: {
        title: data.title,
        content: data.content,
        author_id: userId,
        status: data.status || "PUBLISHED",
        meta_title: data.meta_title,         // 🔥 SEO Field
        meta_description: data.meta_description, // 🔥 SEO Field
      },
    });
  }

  async getAll(page: number = 1, limit: number = 10){
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
        this.prisma.post.findMany({
          skip,
          take: limit,
          include: { author: true },
          orderBy: { created_at: 'desc' },
        }),
        this.prisma.post.count(),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}