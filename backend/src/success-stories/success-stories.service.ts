import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SuccessStoriesService {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: { title: string; content: string; image_url?: string; meta_title?: string; meta_description?: string; author_id: string }) {
        return this.prisma.successStory.create({
            data,
        });
    }

    async findAll() {
        return this.prisma.successStory.findMany({
            orderBy: { created_at: 'desc' },
            include: {
                author: {
                    select: { full_name: true, avatar_url: true }
                }
            }
        });
    }

    async findOne(id: string) {
        return this.prisma.successStory.findUnique({
            where: { id },
            include: {
                author: {
                    select: { full_name: true, avatar_url: true }
                }
            }
        });
    }

    async update(id: string, data: any) {
        return this.prisma.successStory.update({
            where: { id },
            data,
        });
    }

    async remove(id: string) {
        return this.prisma.successStory.delete({
            where: { id },
        });
    }
}