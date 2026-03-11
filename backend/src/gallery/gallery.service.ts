import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GalleryService {

    constructor(private prisma:PrismaService){}

    async upload(image_url:string,caption:string,userId:string){

        return this.prisma.gallery.create({

            data:{
                image_url,
                caption,
                uploaded_by:userId
            }

        })

    }

    async findAll(limit: number = 10, cursor?: string) {
        const data = await this.prisma.gallery.findMany({
            take: limit + 1, // Fetch an extra item to determine if a next cursor exists
            cursor: cursor ? { id: cursor } : undefined,
            orderBy: { created_at: 'desc' },
            include: {
                uploader: { select: { full_name: true, avatar_url: true } },
            },
        });

        let nextCursor: string | null = null;

        // If the array length exceeds the limit, there are more records available
        if (data.length > limit) {
            const nextItem = data.pop(); // Remove the extra inspection element

            // Safely assign the next cursor ID
            if (nextItem) {
                nextCursor = nextItem.id;
            }
        }

        return {
            data,
            meta: {
                nextCursor, // Frontend uses this token for subsequent paginated requests
                limit,
            },
        };
    }
}