import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
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
        const safeLimit = Math.min(Math.max(1, Number(limit) || 10), 100);
        const data = await this.prisma.announcement.findMany({
            take: safeLimit + 1,
            cursor: cursor ? { id: cursor } : undefined,
            orderBy: { created_at: 'desc' },
            include: {
                creator: { select: { full_name: true, avatar_url: true } }
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
        const announcement = await this.prisma.announcement.findUnique({
            where: { id },
            include: {
                creator: {
                    select: { full_name: true, avatar_url: true },
                },
            },
        });
        if (!announcement) throw new NotFoundException('Announcement not found');
        return announcement;
    }

    async update(id: string, data: UpdateAnnouncementDto, userId: string, roles: string[] = []) {
        const announcement = await this.prisma.announcement.findUnique({ where: { id } });
        if (!announcement) throw new NotFoundException('Announcement not found');

        const isAdmin = roles.includes('ADMIN');
        if (!isAdmin && announcement.created_by !== userId) {
            throw new ForbiddenException('You can only update announcements you created');
        }

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