import { Injectable, CanActivate, ExecutionContext, ForbiddenException, Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../common/decorators/roles.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
      private reflector: Reflector, 
      private prisma: PrismaService,
      @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user || (!user.id && !user.sub)) {
            throw new ForbiddenException('User not authenticated');
        }
        
        const userId = user.id || user.sub;
        const cacheKey = `user-roles:${userId}`;
        
        let userRoles: string[] | undefined = await this.cacheManager.get<string[]>(cacheKey);

        if (!userRoles) {
            const userWithRoles = await this.prisma.profile.findUnique({
                where: { id: userId },
                include: {
                    user_roles: {
                        include: { role: true }
                    }
                }
            });

            if (!userWithRoles) {
                throw new ForbiddenException('User profile not found in database');
            }

            userRoles = userWithRoles.user_roles.map(ur => ur.role.name.toUpperCase());
            // Cache roles for 5 minutes
            await this.cacheManager.set(cacheKey, userRoles, 300000);
        }

        const hasRole = requiredRoles.some((role) => userRoles!.includes(role.toUpperCase()));

        if (!hasRole) {
            throw new ForbiddenException(`Access denied. Requires one of these roles: ${requiredRoles.join(', ')}`);
        }

        return true;
    }
}