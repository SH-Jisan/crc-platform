import { Module } from "@nestjs/common";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";
import { PrismaModule } from "../prisma/prisma.module"; // 🔥 PrismaModule ইমপোর্ট করুন

@Module({
  imports: [PrismaModule], // 🔥 এই লাইনটি অ্যাড করতে হবে
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
