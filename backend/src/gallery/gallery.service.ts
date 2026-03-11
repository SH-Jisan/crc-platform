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
            take: limit + 1, // Amra ekta extra data anbo check korar jonno je aaro data ache kina
            cursor: cursor ? { id: cursor } : undefined,
            orderBy: { created_at: 'desc' },
            include: {
                uploader: { select: { full_name: true, avatar_url: true } },
            },
        });

        let nextCursor: string | null = null;

        // Jodi limit er theke beshi data ashe (mane aaro data baki ache)
        if (data.length > limit) {
            const nextItem = data.pop(); // Extra data ta ber kore nilam

            // TypeScript ke shanto korar jonno ei check ta kora holo
            if (nextItem) {
                nextCursor = nextItem.id;
            }
        }

        return {
            data,
            meta: {
                nextCursor, // Frontend ei cursor ta pathabe next data anar jonno
                limit,
            },
        };
    }
}