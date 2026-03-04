import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfileWithRole(userId: string) {
    return this.prisma.profile.findUnique({
      where: { id: userId },
      include: {
        user_roles: {
          include: {
            role: true,
          },
        },
      },
    });
  }
}