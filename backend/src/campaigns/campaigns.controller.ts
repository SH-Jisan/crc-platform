import {Controller, Get, Post, Body, UseGuards, Query} from "@nestjs/common";
import { CampaignsService } from "./campaigns.service";
import { AuthGuard } from "src/auth/auth.guard"; // পাথ আপনার প্রোজেক্ট অনুযায়ী ঠিক করে নিবেন
import { RolesGuard } from "src/auth/roles.guard";
import { CreateCampaignDto } from "./dto/create-campaign.dto";
import {PaginationQueryDto} from "../common/dto/pagination-query.dto";

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
  getCampaigns(@Query() paginationQuery: PaginationQueryDto){
    const { page, limit } = paginationQuery;
    return this.campaignsService.getCampaigns(page, limit );
  }
}
