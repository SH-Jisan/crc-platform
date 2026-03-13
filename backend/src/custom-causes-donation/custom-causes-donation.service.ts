import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomCauseDonationDto } from './dto/create-custom-cause-donation.dto';

@Injectable()
export class CustomCausesDonationService {
    constructor(private prisma: PrismaService) {}

    async create(data: CreateCustomCauseDonationDto, userId: string) {
        const cause = await this.prisma.customCause.create({
            data: {
                title: data.title,
                description: data.description,
                goal_amount: data.goal_amount ? Number(data.goal_amount) : null,
                is_active: data.is_active ?? true,
                created_by: userId,
            }
        });

        return {
            ...cause,
            goal_amount: cause.goal_amount ? Number(cause.goal_amount) : null,
            raised_amount: Number(cause.raised_amount),
        };
    }

    async findAllActive() {
        const causes = await this.prisma.customCause.findMany({
            where: { is_active: true },
            orderBy: { created_at: 'desc' }
        });

        return causes.map(c => ({
            ...c,
            goal_amount: c.goal_amount ? Number(c.goal_amount) : null,
            raised_amount: Number(c.raised_amount),
        }));
    }
}