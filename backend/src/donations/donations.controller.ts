import { Controller, Post, Body, Req, UseGuards } from "@nestjs/common";
import { DonationsService } from "./donations.service";
import { AuthGuard } from "src/auth/auth.guard";
import { CreateDonationDto } from "./dto/create-donation.dto";

@Controller("api/v1/donations")
export class DonationsController {
  constructor(private donationsService: DonationsService) {}

  @UseGuards(AuthGuard)
  @Post()
  donate(@Body() body: CreateDonationDto, @Req() req) {
    return this.donationsService.donate(body, req.user.id);
  }
}
