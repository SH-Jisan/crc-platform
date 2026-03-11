import { Controller, Get, Res, Req, UseGuards } from '@nestjs/common';
import type  { Response } from 'express';
import { DataExportService } from './data-export.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('export')
@UseGuards(AuthGuard, RolesGuard)
@Roles('ADMIN')
export class DataExportController {
    constructor(private readonly dataExportService: DataExportService) {}

    @Get('donations')
    async downloadDonations(@Res() res: Response, @Req() req) {
        // Enforce secure JWT extraction instead of arbitrary query params
        const userId = req.user.id || req.user.sub;
        const csvData = await this.dataExportService.exportDonations(userId);

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=donations.csv');
        res.status(200).send(csvData);
    }

    @Get('members')
    async downloadMembers(@Res() res: Response, @Req() req) {
        const userId = req.user.id || req.user.sub;
        const csvData = await this.dataExportService.exportMembers(userId);

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=members.csv');
        res.status(200).send(csvData);
    }
}