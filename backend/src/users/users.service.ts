import { Injectable, NotFoundException } from "@nestjs/common"; // 🌟 NotFoundException ইমপোর্ট করতে ভুলবে না

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

// ... (তোমার আগের কোডগুলো) ...

// 🌟 Public Profile API (No sensitive data)
  async getPublicProfileByCrcId(crcId: string) {
    const cleanCrcId = crcId.trim();
    const profile = await this.prisma.profile.findUnique({
      where: {
        crc_id: cleanCrcId,
      },
      include: {
        user_roles: {
          include: { role: true },
        },
      },
    });

    // প্রোফাইল না থাকলে বা APPROVED না হলে Error ছুঁড়ে দেবো
    if (!profile || profile.status !== 'APPROVED') {
      throw new NotFoundException('Member not found or not approved yet.');
    }

    // 🌟 সিকিউরিটি: শুধুমাত্র পাবলিক ডাটা রিটার্ন করা হচ্ছে (ইমেইল বা ফোন নম্বর নেই)
    return {
      crc_id: profile.crc_id,
      full_name: profile.full_name,
      avatar_url: profile.avatar_url,
      university: profile.university,
      department: profile.department,
      session: profile.session,
      bio: profile.bio,
      roles: profile.user_roles.map(ur => ur.role.name), // রোলগুলো বের করে আনা হচ্ছে
    };
  }
// পাবলিক মেম্বার লিস্ট আনার জন্য
  async getPublicMembers() {
    const members = await this.prisma.profile.findMany({
      where: { status: 'APPROVED' }, // শুধুমাত্র অ্যাপ্রুভড মেম্বার
      select: {
        id: true,
        crc_id: true,
        full_name: true,
        avatar_url: true,
        department: true,
        university: true,
        session: true,
        user_roles: {
          select: { role: { select: { name: true } } }
        }
      }
    });

    // ডাটা ফরম্যাট করে পাঠানো হচ্ছে
    return members.map(member => ({
      ...member,
      roles: member.user_roles.map(ur => ur.role.name)
    }));
  }
}