import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';

@Injectable()
export class AnnouncementsService {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: CreateAnnouncementDto & { created_by: string }) {
        return this.prisma.announcement.create({
            data,
        });
    }

    async findAll(limit: number = 10, cursor?: string) {
        const data = await this.prisma.announcement.findMany({
            take: limit + 1,
            cursor: cursor ? { id: cursor } : undefined,
            orderBy: { created_at: 'desc' },
            include: {
                creator: { select: { full_name: true, avatar_url: true } }
            }
        });

        let nextCursor: string | null = null;

        if (data.length > limit) {
            const nextItem = data.pop();
            if (nextItem) {
                nextCursor = nextItem.id;
            }
        }

        return {
            data,
            meta: {
                nextCursor,
                limit,
            },
        };
    }

    async findOne(id: string) {
        return this.prisma.announcement.findUnique({
            where: { id },
            include: {
                creator: {
                    select: { full_name: true, avatar_url: true },
                },
            },
        });
    }

    async update(id: string, data: UpdateAnnouncementDto) {
        return this.prisma.announcement.update({
            where: { id },
            data,
        });
    }

    async remove(id: string) {
        return this.prisma.announcement.delete({
            where: { id },
        });
    }
}