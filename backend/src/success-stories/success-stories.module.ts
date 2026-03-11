import { Module } from "@nestjs/common";
import { SuccessStoriesService } from "./success-stories.service";
import { SuccessStoriesController } from "./success-stories.controller";
import { PrismaModule } from "../prisma/prisma.module";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [SuccessStoriesController],
  providers: [SuccessStoriesService],
})
export class SuccessStoriesModule {}
