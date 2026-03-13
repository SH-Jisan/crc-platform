import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDonationDto } from './dto/create-donation.dto';

@Injectable()
export class DonationsService {
    constructor(private prisma: PrismaService) {}

    async create(createDonationDto: CreateDonationDto, userId?: string) {
        // ১. আগে চেক করবো ক্যাম্পেইনটি আছে কি না
        const campaign = await this.prisma.campaign.findUnique({
            where: { id: createDonationDto.campaign_id }
        });

        if (!campaign) {
            throw new NotFoundException('Campaign not found');
        }

        // ২. ডাটাবেস ট্রানজেকশন (ডোনেশন সেভ হবে + ক্যাম্পেইনের ফান্ড আপডেট হবে)
        const result = await this.prisma.$transaction(async (prisma) => {
            // ডোনেশন রেকর্ড তৈরি
            const donation = await prisma.donation.create({
                data: {
                    campaign_id: createDonationDto.campaign_id,
                    amount: createDonationDto.amount,
                    method: createDonationDto.method,
                    transaction_id: createDonationDto.transaction_id,
                    user_id: userId, // কে ডোনেট করেছে তার আইডি
                }
            });

            // ক্যাম্পেইনের raised_amount আপডেট করা
            await prisma.campaign.update({
                where: { id: createDonationDto.campaign_id },
                data: {
                    raised_amount: {
                        increment: createDonationDto.amount
                    }
                }
            });

            return donation;
        });

        return result;
    }
}