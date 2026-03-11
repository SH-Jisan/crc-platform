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
        // Format query for Postgres Full Text Search (e.g. "foo bar" -> "foo | bar")
        const formattedQuery = searchQuery.split(/\s+/).join(' | ');

        // 1. Search in Events
        const events = await this.prisma.event.findMany({
            where: {
                OR: [
                    { title: { search: formattedQuery } },
                    { description: { search: formattedQuery } },
                    { location: { search: formattedQuery } },
                ],
            },
            orderBy: { event_date: 'desc' },
            take: 5, // Return only the top 5 relevant matches
        });

        // 2. Search in Campaigns
        const campaigns = await this.prisma.campaign.findMany({
            where: {
                OR: [
                    { title: { search: formattedQuery } },
                    { description: { search: formattedQuery } },
                ],
            },
            orderBy: { start_date: 'desc' },
            take: 5,
        });

        // 3. Search in Posts (Blog)
        const posts = await this.prisma.post.findMany({
            where: {
                OR: [
                    { title: { search: formattedQuery } },
                    { content: { search: formattedQuery } },
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