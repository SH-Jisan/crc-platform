import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private prisma: PrismaService) {}

    async canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest();
        const userId = req.user.id;

        const user = await this.prisma.profile.findUnique({
            where: { id: userId },
            include: {
                user_roles: {
                    include: { role: true },
                },
            },
        });

        const role = user?.user_roles?.[0]?.role?.name;

        return role === 'ADMIN';
    }
}