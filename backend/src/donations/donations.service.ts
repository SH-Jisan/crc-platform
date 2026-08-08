import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDonationDto } from './dto/create-donation.dto';

@Injectable()
export class DonationsService {
    constructor(private prisma: PrismaService) {}

    async create(data: CreateDonationDto, userId?: string) {
        return this.prisma.$transaction(async (prisma) => {
            const donationData: any = {
                donation_type: data.donation_type,
                amount: data.amount,
                method: data.method,
                transaction_id: data.transaction_id,
                user_id: userId,
                is_anonymous: data.is_anonymous || false,
                donor_name: data.donor_name,
                donor_email: data.donor_email,
                donor_phone: data.donor_phone,
            };

            if (data.donation_type === 'CAMPAIGN') {
                if (!data.campaign_id) throw new BadRequestException('Campaign ID is required!');

                const campaign = await prisma.campaign.findUnique({ where: { id: data.campaign_id } });
                if (!campaign) throw new NotFoundException('Campaign not found');
                if (!campaign.is_donation_enabled) throw new BadRequestException('Donations are currently disabled for this campaign');

                donationData.campaign_id = data.campaign_id;

                await prisma.campaign.update({
                    where: { id: data.campaign_id },
                    data: { raised_amount: { increment: data.amount } }
                });
            }
            else if (data.donation_type === 'EVENT') {
                if (!data.event_id) throw new BadRequestException('Event ID is required!');

                const event = await prisma.event.findUnique({ where: { id: data.event_id } });
                if (!event) throw new NotFoundException('Event not found');
                if (!event.is_donation_enabled) throw new BadRequestException('Donations are currently disabled for this event');

                donationData.eventId = data.event_id;

                await prisma.event.update({
                    where: { id: data.event_id },
                    data: { raised_amount: { increment: data.amount } }
                });
            }
            else if (data.donation_type === 'CUSTOM') {
                if (!data.custom_cause_id) throw new BadRequestException('Custom Cause ID is required!');

                const cause = await prisma.customCause.findUnique({ where: { id: data.custom_cause_id } });
                if (!cause) throw new NotFoundException('Custom cause not found');
                if (!cause.is_active) throw new BadRequestException('This cause is no longer active');

                donationData.custom_cause_id = data.custom_cause_id;

                await prisma.customCause.update({
                    where: { id: data.custom_cause_id },
                    data: { raised_amount: { increment: data.amount } }
                });
            }

            try {
                const donation = await prisma.donation.create({
                    data: donationData
                });

                return donation;
            } catch (error: any) {
                if (error?.code === 'P2002') {
                    throw new ConflictException('A donation with this transaction ID already exists');
                }
                throw error;
            }
        });
    }
}