import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSuccessStoryDto } from './dto/create-success-story.dto';
import { UpdateSuccessStoryDto } from './dto/update-success-story.dto';

@Injectable()
export class SuccessStoriesService {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: CreateSuccessStoryDto & { author_id: string }) {
        return this.prisma.successStory.create({
            data,
        });
    }

    async findAll(limit: number = 10, cursor?: string) {
        const safeLimit = Math.min(Math.max(1, Number(limit) || 10), 100);
        const data = await this.prisma.successStory.findMany({
            take: safeLimit + 1,
            cursor: cursor ? { id: cursor } : undefined,
            orderBy: { created_at: 'desc' },
            include: {
                author: { select: { full_name: true, avatar_url: true } }
            }
        });

        let nextCursor: string | null = null;

        if (data.length > safeLimit) {
            const nextItem = data.pop();
            if (nextItem) {
                nextCursor = nextItem.id;
            }
        }

        return {
            data,
            meta: {
                nextCursor,
                limit: safeLimit,
            },
        };
    }

    async findOne(id: string) {
        const story = await this.prisma.successStory.findUnique({
            where: { id },
            include: {
                author: { select: { full_name: true, avatar_url: true } }
            }
        });
        if (!story) throw new NotFoundException('Success story not found');
        return story;
    }

    async update(id: string, data: UpdateSuccessStoryDto, userId: string, roles: string[] = []) {
        const story = await this.prisma.successStory.findUnique({ where: { id } });
        if (!story) throw new NotFoundException('Success story not found');

        const isAdmin = roles.includes('ADMIN');
        if (!isAdmin && story.author_id !== userId) {
            throw new ForbiddenException('You can only update your own success stories');
        }

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