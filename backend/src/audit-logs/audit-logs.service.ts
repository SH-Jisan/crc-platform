import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditLogsService {
    constructor(private readonly prisma: PrismaService) {}

    // Ei method ta amra onno service theke call korbo (jemon EventsService, AdminService theke)
    async createLog(data: {
        action: string;
        entity: string;
        entity_id?: string;
        details?: any; // JSON object hisabe asbe
        ip_address?: string;
        user_id?: string;
    }) {
        return this.prisma.auditLog.create({
            data: {
                action: data.action,
                entity: data.entity,
                entity_id: data.entity_id,
                details: data.details,
                ip_address: data.ip_address,
                user_id: data.user_id,
            },
        });
    }

    // Admin panel e shob log dekhabar jonno API endpoint er logic
    async findAll() {
        return this.prisma.auditLog.findMany({
            orderBy: { created_at: 'desc' },
            include: {
                user: {
                    select: { full_name: true, avatar_url: true },
                },
            },
        });
    }
}