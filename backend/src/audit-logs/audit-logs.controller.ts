import { Controller, Get } from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service';

@Controller('audit-logs')
export class AuditLogsController {
    constructor(private readonly auditLogsService: AuditLogsService) {}

    // Frontend theke sudhu Admin ra ei route e hit kore shob log dekhte parbe
    // (Security r jonno Admin verification ba Role Guard amra Next step-e add korbo)
    @Get()
    findAll() {
        return this.auditLogsService.findAll();
    }
}