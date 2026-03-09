import { Module } from '@nestjs/common';
import { CampaignsController } from './campaigns.controller';
import { CampaignsService } from './campaigns.service';
import { PrismaModule } from '../prisma/prisma.module'; // 🔥 PrismaModule ইমপোর্ট করুন (পাথ আপনার ফোল্ডার অনুযায়ী ঠিক করে নিবেন)

@Module({
  imports: [PrismaModule], // 🔥 এই লাইনটি অ্যাড করতে হবে
  controllers: [CampaignsController],
  providers: [CampaignsService]
})
export class CampaignsModule {}