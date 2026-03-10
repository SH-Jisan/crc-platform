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

  getAll() {
    return this.prisma.post.findMany({
      include: { author: true },
    });
  }
}