import { Controller, Get, Patch, Body, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { AuthGuard } from "../auth/auth.guard";
import { plainToInstance } from "class-transformer";
import { UserResponseDto } from "./dto/user-response.dto";
import { GetUser } from "../common/decorators/get-user.decorator";

@Controller("users")
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("me")
  async getMe(@GetUser() user: any) {
    const userId = user?.id || user?.sub;
    const profile = await this.usersService.getProfileWithRole(userId);
    return plainToInstance(UserResponseDto, profile);
  }

  // 🌟 সাইনআপের পর ইউজারের ডিটেইলস সেভ করার রাউট
  @Patch("profile")
  async completeProfile(@GetUser() user: any, @Body() body: any) {
    const userId = user?.id || user?.sub;
    return this.usersService.upsertProfile(userId, body);
  }
}