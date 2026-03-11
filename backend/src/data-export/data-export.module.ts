import { Module } from '@nestjs/common';
import { DataExportService } from './data-export.service';
import { DataExportController } from './data-export.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuditLogsModule, AuthModule],
  controllers: [DataExportController],
  providers: [DataExportService],
})
export class DataExportModule {}