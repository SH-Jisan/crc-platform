import { Controller, Get, Patch, Body, UseGuards, Param } from "@nestjs/common";
import { UsersService } from "./users.service";
import { Public } from "../common/decorators/public.decorator"; // 🌟 Public Decorator
import { AuthGuard } from "../auth/auth.guard";
import { plainToInstance } from "class-transformer";
import { UserResponseDto } from "./dto/user-response.dto";
import { GetUser } from "../common/decorators/get-user.decorator";

@Controller("users")
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 🌟 THE FIX: Members লিস্টের রাউটটি অবশ্যই :crcId এর উপরে থাকতে হবে!
  @Public()
  @Get('public/members')
  async getPublicMembers(){
    return this.usersService.getPublicMembers();
  }

  // 🌟 Single Profile রাউটটি নিচে চলে আসলো
  @Public()
  @Get("public/:crcId")
  async getPublicProfile(@Param("crcId") crcId: string) {
    return this.usersService.getPublicProfileByCrcId(crcId);
  }

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