import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { parse } from 'json2csv';

@Injectable()
export class DataExportService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly auditLogsService: AuditLogsService,
    ) {}

    // Donation Data Export
    async exportDonations(userId: string) {
        const donations = await this.prisma.donation.findMany({
            include: {
                user: { select: { full_name: true, phone: true } },
                campaign: { select: { title: true } },
            },
            orderBy: { created_at: 'desc' },
        });

        const formattedData = donations.map((d) => ({
            ID: d.id,
            Date: d.created_at.toISOString().split('T')[0],
            Donor_Name: d.user?.full_name || 'Anonymous',
            Phone: d.user?.phone || 'N/A',
            Campaign: d.campaign?.title || 'N/A',
            Amount: d.amount,
            Method: d.method,
            Transaction_ID: d.transaction_id || 'N/A',
        }));

        // Log the action
        await this.auditLogsService.createLog({
            action: 'EXPORT_DONATIONS',
            entity: 'Donation',
            user_id: userId,
            details: { recordCount: formattedData.length },
        });

        return parse(formattedData);
    }

    // Member/Volunteer Data Export
    async exportMembers(userId: string) {
        const members = await this.prisma.profile.findMany({
            include: {
                user_roles: {
                    include: { role: true }
                }
            },
            orderBy: { created_at: 'desc' },
        });

        const formattedData = members.map((m) => ({
            ID: m.id,
            Name: m.full_name || 'N/A',
            Phone: m.phone || 'N/A',
            Joined_Date: m.created_at.toISOString().split('T')[0],
            Roles: m.user_roles.map(ur => ur.role.name).join(', ') || 'USER',
        }));

        // Log the action
        await this.auditLogsService.createLog({
            action: 'EXPORT_MEMBERS',
            entity: 'Profile',
            user_id: userId,
            details: { recordCount: formattedData.length },
        });

        return parse(formattedData);
    }
}