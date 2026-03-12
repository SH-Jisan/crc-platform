import { Controller, Get, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { AuthGuard } from "../auth/auth.guard";
import { plainToInstance } from "class-transformer";
import { UserResponseDto } from "./dto/user-response.dto";
import { GetUser } from "../common/decorators/get-user.decorator"; // 🔥 আমাদের কাস্টম ডেকোরেটর

@Controller("users")
@UseGuards(AuthGuard) // 🔥 পুরো কন্ট্রোলারকে প্রটেক্ট করে দিলাম, যাতে ভবিষ্যতে নতুন API বানালেও সিকিউর থাকে
export class UsersController {
  constructor(private readonly usersService: UsersService) {} // 🔥 readonly অ্যাড করা হলো

  @Get("me")
  async getMe(@GetUser() user: any) {
    // 🔥 @Req() বাদ দিয়ে সরাসরি ডেকোরেটর থেকে ইউজার ডাটা নিলাম।
    // Supabase টোকেনে আইডি id বা sub হিসেবে থাকতে পারে।
    const userId = user?.id || user?.sub;

    const profile = await this.usersService.getProfileWithRole(userId);

    return plainToInstance(UserResponseDto, profile);
  }
}