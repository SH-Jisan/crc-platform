import { Module } from '@nestjs/common';
import { CustomCausesDonationService } from './custom-causes-donation.service';
import { CustomCausesDonationController } from './custom-causes-donation.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [CustomCausesDonationService],
  controllers: [CustomCausesDonationController]
})
export class CustomCausesDonationModule {}
