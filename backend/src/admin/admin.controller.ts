import {Body, Controller, Get, Param, Patch, UseGuards} from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AuthGuard } from "../auth/auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";

@Controller("api/v1/admin")
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Roles('ADMIN')
  @UseGuards(AuthGuard, RolesGuard)
  @Get("stats")
  stats() {
    return this.adminService.getStats();
  }

  @Roles('ADMIN')
  @UseGuards(AuthGuard, RolesGuard)
  @Get("recent-events")
  recentEvents() {
    return this.adminService.recentEvents();
  }

  @Roles('ADMIN')
  @UseGuards(AuthGuard, RolesGuard)
  @Get("recent-donations")
  recentDonations() {
    return this.adminService.recentDonations();
  }

  @Roles('ADMIN')
  @UseGuards(AuthGuard, RolesGuard)
  @Get("pending-members")
  getPendingMembers(){
    return this.adminService.getPendingMembers();
  }

  @Roles('ADMIN')
  @UseGuards(AuthGuard, RolesGuard)
  @Patch("members/:id/status")
  updateMemberStatus(
      @Param('id') id: string,
      @Body () body: {status: 'APPROVED' | 'REJECTED'; role?: string; crc_id?: string}
  ) {
    return this.adminService.updateMemberStatus(id, body.status, body.role || 'MEMBER', body.crc_id);
  }

  @Roles('ADMIN')
  @UseGuards(AuthGuard, RolesGuard)
  @Get("members")
  getApprovedMembers(){
    return this.adminService.getApprovedMembers();
  }

  @Roles('ADMIN')
  @UseGuards(AuthGuard, RolesGuard)
  @Patch("members/:id")
  updateMemberInfo(
      @Param('id') id: string,
      @Body () body: any
  ){
    return this.adminService.updateMemberInfo(id, body);
  }
}
