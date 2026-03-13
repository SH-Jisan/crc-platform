import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { CustomCausesDonationService } from './custom-causes-donation.service';
import { CreateCustomCauseDonationDto } from './dto/create-custom-cause-donation.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { GetUser } from '../common/decorators/get-user.decorator';
import { Public } from '../common/decorators/public.decorator';

// 🌟 API রাউট হবে: POST /custom-causes-donation
@Controller('custom-causes-donation')
export class CustomCausesDonationController {
    constructor(private readonly customCausesService: CustomCausesDonationService) {}

    @Post()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('ADMIN') // 🌟 শুধুমাত্র অ্যাডমিনরাই ইমার্জেন্সি ফান্ড খুলতে পারবে
    create(
        @Body() createCustomCauseDto: CreateCustomCauseDonationDto,
        @GetUser('id') userId: string
    ) {
        return this.customCausesService.create(createCustomCauseDto, userId);
    }

    @Public()
    @Get()
    findAllActive() {
        return this.customCausesService.findAllActive();
    }
}