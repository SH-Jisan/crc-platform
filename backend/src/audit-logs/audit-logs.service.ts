import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class AuditLogsService {
    constructor(private readonly prisma: PrismaService) {}

    @OnEvent('audit.log')
    async createLog(data: {
        action: string;
        entity: string;
        entity_id?: string;
        details?: any; // JSON object hisabe asbe
        ip_address?: string;
        user_id?: string;
    }) {
        try {
            await this.prisma.auditLog.create({
                data: {
                    action: data.action,
                    entity: data.entity,
                    entity_id: data.entity_id || 'N/A',
                    details: data.details || {},
                    ip_address: data.ip_address || '',
                    user_id: data.user_id,
                },
            });
        } catch (error) {
            console.error('Failed to create audit log asynchronously', error);
        }
    }

    async findAll() {
        return this.prisma.auditLog.findMany({
            orderBy: { created_at: 'desc' },
            include: { user: { select: { full_name: true, avatar_url: true } } },
        });
    }
}