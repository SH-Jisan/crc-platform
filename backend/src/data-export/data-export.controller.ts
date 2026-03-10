import { Controller, Get, Res, Query } from '@nestjs/common';
import { Response } from 'express';
import { DataExportService } from './data-export.service';

@Controller('export')
export class DataExportController {
    constructor(private readonly dataExportService: DataExportService) {}

    @Get('donations')
    async downloadDonations(@Res() res: Response, @Query('userId') userId: string) {
        // Note: userId ta ekhon query theke nicchi, pore JWT auth implementation er shomoy Req object theke nibo
        const csvData = await this.dataExportService.exportDonations(userId);

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=donations.csv');
        res.status(200).send(csvData);
    }

    @Get('members')
    async downloadMembers(@Res() res: Response, @Query('userId') userId: string) {
        const csvData = await this.dataExportService.exportMembers(userId);

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=members.csv');
        res.status(200).send(csvData);
    }
}