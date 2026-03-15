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
  // ... আগের কোড (getStats, recentEvents ইত্যাদি) ...

  // 🌟 পেন্ডিং মেম্বারদের লিস্ট আনা
  async getPendingMembers() {
    return this.prisma.profile.findMany({
      where: { status: "PENDING" },
      orderBy: { created_at: "asc" }, // যারা আগে এপ্লাই করেছে, তারা আগে আসবে
    });
  }

  // 🌟 মেম্বার এপ্রুভ/রিজেক্ট করা এবং অটোমেটিক Role Assign করা
  async updateMemberStatus(userId: string, status: 'APPROVED' | 'REJECTED', roleName: string = 'MEMBER') {
    return this.prisma.$transaction(async (prisma) => {
      // ১. প্রোফাইলের স্ট্যাটাস আপডেট করা
      const profile = await prisma.profile.update({
        where: { id: userId },
        data: { status },
      });

      // ২. যদি এপ্রুভ হয়, তবে তাকে স্পেসিফিক Role দেওয়া (যেমন: ADMIN, MEDIA_MANAGER, MEMBER)
      if (status === 'APPROVED') {
        // প্রো-টিপ: ডাটাবেসে Role না থাকলে অটোমেটিক তৈরি (Upsert) করে নেবে, ফলে ক্র্যাশ করবে না!
        const role = await prisma.role.upsert({
          where: { name: roleName },
          update: {},
          create: { name: roleName },
        });

        // আগে থেকেই এই Role আছে কিনা চেক করা (Unique Constraint Error ঠেকানোর জন্য)
        const existingUserRole = await prisma.userRole.findUnique({
          where: { user_id_role_id: { user_id: userId, role_id: role.id } },
        });

        if (!existingUserRole) {
          await prisma.userRole.create({
            data: {
              user_id: userId,
              role_id: role.id,
            },
          });
        }
      }

      return profile;
    });
  }
}
