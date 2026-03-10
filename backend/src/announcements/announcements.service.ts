import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnnouncementsService {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: { title: string; message: string; created_by: string }) {
        return this.prisma.announcement.create({
            data,
        });
    }

    async findAll() {
        return this.prisma.announcement.findMany({
            orderBy: { created_at: 'desc' },
            include: {
                creator: {
                    select: { full_name: true, avatar_url: true },
                },
            },
        });
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

    async update(id: string, data: { title?: string; message?: string }) {
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