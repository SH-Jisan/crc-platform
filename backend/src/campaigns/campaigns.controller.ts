import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from "@nestjs/common";
import { CampaignsService } from "./campaigns.service";
import { AuthGuard } from "../auth/auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { Public } from "../common/decorators/public.decorator";
import { CreateCampaignDto } from "./dto/create-campaign.dto";
import { UpdateCampaignDto } from "./dto/update-campaign.dto";
import { PaginationQueryDto } from "../common/dto/pagination-query.dto";

@Controller("campaigns") // 🔥 Path ঠিক করা হলো
@UseGuards(AuthGuard, RolesGuard)
export class CampaignsController {
  constructor(private campaignsService: CampaignsService) {}

  @Post()
  @Roles('ADMIN', 'MEMBER') // 🔥 Role check add করা হলো
  create(@Body() body: CreateCampaignDto) {
    return this.campaignsService.createCampaign(body);
  }

  @Public() // 🔥 সবাই দেখতে পাবে
  @Get()
  getCampaigns(@Query() paginationQuery: PaginationQueryDto){
    const { page, limit } = paginationQuery;
    return this.campaignsService.getCampaigns(page, limit);
  }

  @Public()
  @Get(':id')
  getCampaignById(@Param('id') id: string) {
    return this.campaignsService.getCampaignById(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'MEMBER')
  updateCampaign(@Param('id') id: string, @Body() updateCampaignDto: UpdateCampaignDto) {
    return this.campaignsService.updateCampaign(id, updateCampaignDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  deleteCampaign(@Param('id') id: string) {
    return this.campaignsService.deleteCampaign(id);
  }
}