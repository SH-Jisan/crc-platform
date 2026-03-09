import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const users = await this.prisma.profile.count();

    const events = await this.prisma.event.count();

    const campaigns = await this.prisma.campaign.count();

    const donations = await this.prisma.donation.aggregate({
      _sum: { amount: true },
    });

    return {
      users,
      events,
      campaigns,
      totalDonations: donations._sum.amount || 0,
    };
  }

  async recentEvents() {
    return this.prisma.event.findMany({
      take: 5,
      orderBy: { created_at: "desc" },
    });
  }

  async recentDonations() {
    return this.prisma.donation.findMany({
      take: 5,
      orderBy: { created_at: "desc" },
    });
  }
}
