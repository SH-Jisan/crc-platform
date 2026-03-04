import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { AuthGuard } from "src/auth/auth.guard";

@Controller("api/v1/users")
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get("me")
  getMe(@Req() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.usersService.getProfileWithRole(req.user.id);
  }
}
