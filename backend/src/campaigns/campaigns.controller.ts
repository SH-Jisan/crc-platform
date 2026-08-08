import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Header, NotFoundException } from "@nestjs/common";
import { CampaignsService } from "./campaigns.service";
import { AuthGuard } from "../auth/auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { Public } from "../common/decorators/public.decorator";
import { CreateCampaignDto } from "./dto/create-campaign.dto";
import { UpdateCampaignDto } from "./dto/update-campaign.dto";
import { PaginationQueryDto } from "../common/dto/pagination-query.dto";

@Controller("campaigns")
@UseGuards(AuthGuard, RolesGuard)
export class CampaignsController {
  constructor(private campaignsService: CampaignsService) {}

  @Post()
  @Roles('ADMIN', 'MEMBER')
  create(@Body() body: CreateCampaignDto) {
    return this.campaignsService.createCampaign(body);
  }

  @Public()
  @Get()
  getCampaigns(@Query() paginationQuery: PaginationQueryDto){
    const { page, limit } = paginationQuery;
    return this.campaignsService.getCampaigns(page, limit);
  }

  @Public()
  @Get(':id/share')
  @Header('Content-Type', 'text/html')
  async getShareableLink(@Param('id') id: string, @Query('redirect') redirectUrl: string) {
      try {
          const campaign = await this.campaignsService.getCampaignById(id);
          const title = campaign.title || 'CRC Fundraising Campaign';
          const description = campaign.description ? campaign.description.substring(0, 150) + '...' : 'Support this cause with Come for Road Child!';
          const imageUrl = campaign.image_url || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop';

          return `
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <title>${title}</title>
              <meta property="og:type" content="article">
              <meta property="og:title" content="${title}">
              <meta property="og:description" content="${description}">
              <meta property="og:image" content="${imageUrl}">
              <meta property="og:url" content="${redirectUrl || '#'}">
              <meta name="twitter:card" content="summary_large_image">
              <meta name="twitter:title" content="${title}">
              <meta name="twitter:description" content="${description}">
              <meta name="twitter:image" content="${imageUrl}">
              <meta http-equiv="refresh" content="0;url=${redirectUrl || '/campaigns'}">
              <script>window.location.href = "${redirectUrl || '/campaigns'}";</script>
          </head>
          <body><p>Redirecting to campaign...</p></body>
          </html>`;
      } catch {
          throw new NotFoundException('Campaign not found');
      }
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