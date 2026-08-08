import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { DonationsService } from './donations.service';
import { CreateDonationDto } from './dto/create-donation.dto';
import { Public } from '../common/decorators/public.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';

@Controller('donations')
@UseGuards(AuthGuard)
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) {}

  @Public()
  @Post()
  create(
      @Body() createDonationDto: CreateDonationDto,
      @GetUser() user?: any
  ) {
    const userId = user?.id || user?.sub;
    return this.donationsService.create(createDonationDto, userId);
  }
}