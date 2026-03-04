import { Module } from "@nestjs/common";
import { EventsController } from "./events.controller";
import { EventsService } from "./events.service";
import { PrismaModule } from "../prisma/prisma.module"; // 🔥 PrismaModule ইম্পোর্ট করা হলো (path আপনার প্রজেক্ট অনুযায়ী ঠিক করে নিবেন)

@Module({
  imports: [PrismaModule], // 🔥 এই লাইনটি অ্যাড করতে হবে
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
