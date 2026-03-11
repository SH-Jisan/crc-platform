import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDonationDto } from './dto/create-donation.dto';

@Injectable()
export class DonationsService {
    constructor(private prisma: PrismaService){}

    async donate(data: CreateDonationDto, userId: string){
        const amount = typeof data.amount === 'string' ? parseFloat(data.amount) : data.amount;

        if (isNaN(amount) || amount <= 0) {
            throw new BadRequestException("Invalid donation amount");
        }

        // Execute Prisma $transaction: Atomically save donation record and increment campaign funds
        return this.prisma.$transaction(async (prisma) => {
            // 1. Create the donation ledger record
            const donation = await prisma.donation.create({
                data: {
                    amount: amount,
                    method: data.method || "BKASH",
                    transaction_id: data.transaction_id || `TRX-${Date.now()}`,
                    campaign_id: data.campaign_id,
                    user_id: userId
                }
            });

            // 2. Increment the raised_amount on the corresponding campaign
            await prisma.campaign.update({
                where: { id: data.campaign_id },
                data: {
                    raised_amount: {
                        increment: amount // Add the new donation payload to previous total
                    }
                }
            });

            return donation;
        });
    }
}