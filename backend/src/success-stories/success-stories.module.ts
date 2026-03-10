import { Module } from "@nestjs/common";
import { SuccessStoriesService } from "./success-stories.service";
import { SuccessStoriesController } from "./success-stories.controller";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [SuccessStoriesController],
  providers: [SuccessStoriesService],
})
export class SuccessStoriesModule {}
