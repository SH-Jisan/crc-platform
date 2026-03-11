import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreatePostDto } from "./dto/create-post.dto";
// UpdatePostDto যদি না থাকে, বানিয়ে নিও
import { UpdatePostDto } from "./dto/update-post.dto";

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  create(data: CreatePostDto, userId: string) {
    return this.prisma.post.create({
      data: {
        title: data.title,
        content: data.content,
        author_id: userId,
        status: data.status || "PUBLISHED",
        meta_title: data.meta_title,
        meta_description: data.meta_description,
      },
    });
  }

  async getAll(page: number = 1, limit: number = 10){
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.post.findMany({
        skip,
        take: limit,
        include: { author: { select: { full_name: true, avatar_url: true } } },
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

  async getPostById(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: { author: { select: { full_name: true, avatar_url: true } } }
    });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async updatePost(id: string, data: UpdatePostDto) {
    return this.prisma.post.update({
      where: { id },
      data,
    });
  }

  async deletePost(id: string) {
    return this.prisma.post.delete({
      where: { id }
    });
  }
}