import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DonationsService {
    constructor(private prisma: PrismaService){}

    async donate(data: any, userId: string){
        const amount = parseFloat(data.amount);

        if (isNaN(amount) || amount <= 0) {
            throw new BadRequestException("Invalid donation amount");
        }

        // 🔥 Prisma $transaction: ডোনেশন সেভ হবে এবং ক্যাম্পেইনের ফান্ড বাড়বে (দুটি এক সাথে)
        return this.prisma.$transaction(async (prisma) => {
            // ১. ডোনেশন রেকর্ড তৈরি করা
            const donation = await prisma.donation.create({
                data: {
                    amount: amount,
                    method: data.method || "BKASH",
                    transaction_id: data.transaction_id || `TRX-${Date.now()}`,
                    campaign_id: data.campaign_id,
                    user_id: userId
                }
            });

            // ২. ক্যাম্পেইনের raised_amount আপডেট (increment) করা
            await prisma.campaign.update({
                where: { id: data.campaign_id },
                data: {
                    raised_amount: {
                        increment: amount // 🔥 আগে যা ছিল তার সাথে নতুন এমাউন্ট যোগ হবে
                    }
                }
            });

            return donation;
        });
    }
}