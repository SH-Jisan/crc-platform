import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../common/decorators/roles.decorator';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector, private prisma: PrismaService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) {
            return true; // Kono specific role na lagle allow korbe
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            throw new ForbiddenException('User not authenticated');
        }

        // Database theke user er asol role verify kora (Security)
        const userWithRoles = await this.prisma.profile.findUnique({
            where: { id: user.id },
            include: {
                user_roles: {
                    include: { role: true }
                }
            }
        });

        if (!userWithRoles) {
            throw new ForbiddenException('User profile not found in database');
        }

        const userRoles = userWithRoles.user_roles.map(ur => ur.role.name.toUpperCase());

        const hasRole = requiredRoles.some((role) => userRoles.includes(role.toUpperCase()));

        if (!hasRole) {
            throw new ForbiddenException(`Access denied. Requires one of these roles: ${requiredRoles.join(', ')}`);
        }

        return true;
    }
}