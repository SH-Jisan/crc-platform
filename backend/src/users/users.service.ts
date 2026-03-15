import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfileWithRole(userId: string) {
    return this.prisma.profile.findUnique({
      where: { id: userId },
      include: {
        user_roles: {
          include: { role: true },
        },
      },
    });
  }

  // 🌟 PRO-LEVEL: Update or Insert (Upsert) Profile
  async upsertProfile(userId: string, data: any) {
    return this.prisma.profile.upsert({
      where: { id: userId },
      update: {
        full_name: data.full_name,
        phone: data.phone,
        university: data.university,
        department: data.department,
        session: data.session,
        student_id: data.student_id,
        // Status PENDING ই থাকবে বাই ডিফল্ট
      },
      create: {
        id: userId,
        full_name: data.full_name,
        phone: data.phone,
        university: data.university,
        department: data.department,
        session: data.session,
        student_id: data.student_id,
        status: 'PENDING', // নতুন সাইনআপ সবসময় PENDING
      },
    });
  }
}