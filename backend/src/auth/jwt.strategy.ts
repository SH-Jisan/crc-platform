import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
      private configService: ConfigService,
      private prisma: PrismaService // 🌟 Prisma ইনজেক্ট করা হলো
  ) {
    const secret = configService.get<string>('SUPABASE_JWT_SECRET');
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret || 'super-secret-default-which-should-be-changed-in-env',
    });
  }

  async validate(payload: any) {
    if (!payload?.sub) {
      throw new UnauthorizedException('Invalid token payload');
    }

    // 🌟 রিয়েল-টাইমে ডাটাবেস থেকে ইউজারের বর্তমান স্ট্যাটাস এবং রোল আনা
    const userProfile = await this.prisma.profile.findUnique({
      where: { id: payload.sub },
      include: {
        user_roles: {
          include: { role: true },
          orderBy: { assigned_at: 'desc' } // সর্বশেষ অ্যাসাইন করা রোলটি আগে আসবে
        }
      }
    });

    if (!userProfile) {
      throw new UnauthorizedException('User not found');
    }

    // কেউ যদি লগইন থাকার পর তাকে Reject বা Pending করা হয়, তবে সাথে সাথে কিক!
    if (userProfile.status !== 'APPROVED') {
      throw new UnauthorizedException('Account is not active.');
    }

    // 🌟 THE AUTO-LOGOUT MAGIC 🌟
    // payload.iat (Issued At) হলো টোকেন তৈরির সময় (সেকেন্ডে), তাই 1000 দিয়ে গুণ করে মিলি-সেকেন্ড করা হলো
    const tokenIssuedAt = payload.iat * 1000;

    if (userProfile.user_roles.length > 0) {
      const lastAssignedAt = userProfile.user_roles[0].assigned_at.getTime();

      // 🌟 যদি ইউজারের রোল অ্যাডমিন তার লগইন করার (টোকেন তৈরির) *পরে* চেঞ্জ করে থাকে,
      // তার মানে তার বর্তমান সেশন বাতিল! তাকে লগআউট করতে হবে।
      if (lastAssignedAt > tokenIssuedAt) {
        throw new UnauthorizedException('Your role has been updated. Please log in again.');
      }
    }

    const roles = userProfile.user_roles.map(ur => ur.role.name);

    return { id: userProfile.id, email: payload.email, roles };
  }
}