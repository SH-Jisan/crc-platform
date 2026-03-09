import { Controller, Get, UseGuards } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AuthGuard } from "src/auth/auth.guard";
import { RolesGuard } from "src/auth/roles.guard";

@Controller("api/v1/admin")
export class AdminController {
  constructor(private adminService: AdminService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Get("stats")
  stats() {
    return this.adminService.getStats();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Get("recent-events")
  recentEvents() {
    return this.adminService.recentEvents();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Get("recent-donations")
  recentDonations() {
    return this.adminService.recentDonations();
  }
}
