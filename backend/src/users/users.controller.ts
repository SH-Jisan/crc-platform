import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { AuthGuard } from "../auth/auth.guard";
import { plainToInstance } from "class-transformer";
import { UserResponseDto } from "./dto/user-response.dto";

@Controller("users") // Rely on main.ts versioning for /api/v1 prefix
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get("me")
  async getMe(@Req() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const profile = await this.usersService.getProfileWithRole(req.user.id || req.user.sub);
    return plainToInstance(UserResponseDto, profile);
  }
}
