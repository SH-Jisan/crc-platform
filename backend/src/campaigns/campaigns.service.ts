import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
// যদি UpdateCampaignDto না থাকে, তাহলে একটা বানিয়ে নিও (আগের নিয়মে)
import { UpdateCampaignDto } from './dto/update-campaign.dto';

@Injectable()
export class CampaignsService {
    constructor(private prisma: PrismaService){}

    createCampaign(data: CreateCampaignDto){
        return this.prisma.campaign.create({
            data: {
                title: data.title,
                description: data.description,
                goal_amount: parseFloat(data.goal_amount.toString()),
                status: "ACTIVE",
                start_date: data.start_date ? new Date(data.start_date) : null,
                end_date: data.end_date ? new Date(data.end_date) : null,
                meta_title: data.meta_title,
                meta_description: data.meta_description,
            }
        });
    }

    async getCampaigns(page: number = 1, limit: number = 10){
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            this.prisma.campaign.findMany({
                skip,
                take: limit,
                include: { donations: true },
                orderBy: { start_date: 'desc' },
            }),
            this.prisma.campaign.count(),
        ]);
        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total/limit),
            },
        };
    }

    async getCampaignById(id: string) {
        const campaign = await this.prisma.campaign.findUnique({
            where: { id },
            include: { donations: true }
        });
        if (!campaign) throw new NotFoundException('Campaign not found');
        return campaign;
    }

    async updateCampaign(id: string, data: UpdateCampaignDto) {
        return this.prisma.campaign.update({
            where: { id },
            data: {
                ...data,
                goal_amount: data.goal_amount ? parseFloat(data.goal_amount.toString()) : undefined,
                start_date: data.start_date ? new Date(data.start_date) : undefined,
                end_date: data.end_date ? new Date(data.end_date) : undefined,
            }
        });
    }

    async deleteCampaign(id: string) {
        return this.prisma.campaign.delete({
            where: { id }
        });
    }
}