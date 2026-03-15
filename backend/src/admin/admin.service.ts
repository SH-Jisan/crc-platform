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

  // 🌟 ১. শুধু Approved মেম্বারদের লিস্ট আনা
  async getApprovedMembers() {
    return this.prisma.profile.findMany({
      where: { status: "APPROVED" },
      include: {
        user_roles: {
          include: { role: true },
        },
      },
      orderBy: { created_at: "desc" },
    });
  }

  // 🌟 মেম্বার এপ্রুভ/রিজেক্ট করা
  async updateMemberStatus(userId: string, status: 'APPROVED' | 'REJECTED', roleName: string = 'MEMBER') {
    return this.prisma.$transaction(async (prisma) => {
      const profile = await prisma.profile.update({
        where: { id: userId },
        data: { status },
      });

      if (status === 'APPROVED') {
        // ১. Role টেবিলে রোল নিশ্চিত করা
        const role = await prisma.role.upsert({
          where: { name: roleName },
          update: {},
          create: { name: roleName },
        });

        // ২. পুরোনো সব রোল ডিলিট করে ফ্রেশ করে নতুন রোল অ্যাসাইন করা (UserRole Fix)
        await prisma.userRole.deleteMany({
          where: { user_id: userId },
        });

        await prisma.userRole.create({
          data: {
            user_id: userId,
            role_id: role.id,
            assigned_at: new Date(), // 🌟 এটি Auto Logout এর জন্য সবচেয়ে জরুরি!
          },
        });
      }
      return profile;
    });
  }

  // 🌟 মেম্বারদের Info এবং Role আপডেট করা
  async updateMemberInfo(userId: string, data: any) {
    return this.prisma.$transaction(async (prisma) => {
      const profile = await prisma.profile.update({
        where: { id: userId },
        data: {
          full_name: data.full_name,
          phone: data.phone,
          university: data.university,
          department: data.department,
          session: data.session,
        },
      });

      if (data.roleName) {
        const role = await prisma.role.upsert({
          where: { name: data.roleName },
          update: {},
          create: { name: data.roleName },
        });

        // 🌟 পুরোনো রোল মুছে নতুন রোল দেওয়া এবং টাইম আপডেট করা
        await prisma.userRole.deleteMany({
          where: { user_id: userId },
        });

        await prisma.userRole.create({
          data: {
            user_id: userId,
            role_id: role.id,
            assigned_at: new Date(), // 🌟 এটি Auto Logout ট্রিগার করবে!
          },
        });
      }
      return profile;
    });
  }
}
