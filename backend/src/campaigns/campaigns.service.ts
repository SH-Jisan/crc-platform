import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CampaignsService {
    constructor(private prisma: PrismaService){}

    createCampaign(data: any){
        return this.prisma.campaign.create({
            data: {
                title: data.title,
                description: data.description,
                goal_amount: parseFloat(data.goal_amount),
                status: data.status || "ACTIVE",
                start_date: data.start_date ? new Date(data.start_date) : null,
                end_date: data.end_date ? new Date(data.end_date) : null,
                meta_title: data.meta_title,         // 🔥 SEO Field
                meta_description: data.meta_description, // 🔥 SEO Field
            }
        });
    }

    getCampaigns(){
        return this.prisma.campaign.findMany({
            include: {
                donations: true
            },
            orderBy: { start_date: 'desc' }
        });
    }
}