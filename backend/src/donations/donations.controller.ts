import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { DonationsService } from './donations.service';
import { CreateDonationDto } from './dto/create-donation.dto';
import { AuthGuard } from '../auth/auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';

@Controller('donations')
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) {}

  @Post()
  @UseGuards(AuthGuard) // শুধুমাত্র লগিন করা ইউজাররাই ডোনেট করতে পারবে
  create(
      @Body() createDonationDto: CreateDonationDto,
      @GetUser('id') userId: string // টোকেন থেকে ইউজারের আইডি নেওয়া হচ্ছে
  ) {
    return this.donationsService.create(createDonationDto, userId);
  }
}