import { Controller, Get, UseGuards } from "@nestjs/common";
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
}
