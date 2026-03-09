import { Module } from "@nestjs/common";
import { PostsController } from "./posts.controller";
import { PostsService } from "./posts.service";
import { PrismaModule } from "../prisma/prisma.module"; // 🔥 PrismaModule যুক্ত করা হলো

@Module({
  imports: [PrismaModule], // 🔥 ডাটাবেসের জন্য
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
