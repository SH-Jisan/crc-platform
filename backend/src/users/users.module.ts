import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { PrismaModule } from "../prisma/prisma.module"; // 🔥 ADD THIS

@Module({
  imports: [PrismaModule], // 🔥 IMPORTANT
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
