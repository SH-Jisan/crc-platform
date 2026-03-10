import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SearchService {
    constructor(private readonly prisma: PrismaService) {}

    async globalSearch(query: string) {
        if (!query || query.trim() === '') {
            return { events: [], campaigns: [], posts: [] };
        }

        const searchQuery = query.trim();

        // 1. Search in Events
        const events = await this.prisma.event.findMany({
            where: {
                OR: [
                    { title: { contains: searchQuery, mode: 'insensitive' } },
                    { description: { contains: searchQuery, mode: 'insensitive' } },
                    { location: { contains: searchQuery, mode: 'insensitive' } },
                ],
            },
            orderBy: { event_date: 'desc' },
            take: 5, // Shudhu top 5 result dekhabo
        });

        // 2. Search in Campaigns
        const campaigns = await this.prisma.campaign.findMany({
            where: {
                OR: [
                    { title: { contains: searchQuery, mode: 'insensitive' } },
                    { description: { contains: searchQuery, mode: 'insensitive' } },
                ],
            },
            orderBy: { start_date: 'desc' },
            take: 5,
        });

        // 3. Search in Posts (Blog)
        const posts = await this.prisma.post.findMany({
            where: {
                OR: [
                    { title: { contains: searchQuery, mode: 'insensitive' } },
                    { content: { contains: searchQuery, mode: 'insensitive' } },
                ],
            },
            orderBy: { created_at: 'desc' },
            take: 5,
            include: {
                author: { select: { full_name: true } }
            }
        });

        return {
            query: searchQuery,
            results: {
                events,
                campaigns,
                posts,
            },
        };
    }
}