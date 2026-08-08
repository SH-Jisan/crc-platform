import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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
        const safeLimit = Math.min(Math.max(1, Number(limit) || 10), 100);
        const data = await this.prisma.gallery.findMany({
            take: safeLimit + 1,
            cursor: cursor ? { id: cursor } : undefined,
            orderBy: { created_at: 'desc' },
            include: {
                uploader: { select: { full_name: true, avatar_url: true } },
            },
        });

        let nextCursor: string | null = null;

        // If the array length exceeds the limit, there are more records available
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
}