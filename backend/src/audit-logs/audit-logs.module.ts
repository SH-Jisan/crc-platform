import { Module } from "@nestjs/common";
import { AuditLogsService } from "./audit-logs.service";
import { AuditLogsController } from "./audit-logs.controller";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [AuditLogsController],
  providers: [AuditLogsService],
  exports: [AuditLogsService], // Onno module theke log korar jonno export kora holo
})
export class AuditLogsModule {}
