import { Module } from '@nestjs/common';
import { DonationsController } from './donations.controller';
import { DonationsService } from './donations.service';
import { PrismaModule } from '../prisma/prisma.module'; // 🔥 PrismaModule ইমপোর্ট করুন (পাথ আপনার প্রজেক্ট অনুযায়ী ঠিক করে নিবেন)

@Module({
  imports: [PrismaModule], // 🔥 এই লাইনটি অ্যাড করতে হবে
  controllers: [DonationsController],
  providers: [DonationsService]
})
export class DonationsModule {}