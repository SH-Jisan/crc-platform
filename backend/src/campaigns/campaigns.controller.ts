import { Controller, Get, Post, Body, UseGuards } from "@nestjs/common";
import { CampaignsService } from "./campaigns.service";
import { AuthGuard } from "src/auth/auth.guard"; // পাথ আপনার প্রোজেক্ট অনুযায়ী ঠিক করে নিবেন
import { RolesGuard } from "src/auth/roles.guard";
import { CreateCampaignDto } from "./dto/create-campaign.dto";

@Controller("api/v1/campaigns")
export class CampaignsController {
  constructor(private campaignsService: CampaignsService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  create(@Body() body:CreateCampaignDto) {
    // 🔥 এখন শুধু body পাঠালেই হবে
    return this.campaignsService.createCampaign(body);
  }

  @Get()
  findAll() {
    return this.campaignsService.getCampaigns();
  }
}
