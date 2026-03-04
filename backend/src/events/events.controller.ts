import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Req,
  UseGuards,
} from "@nestjs/common";
import { EventsService } from "./events.service";
import { AuthGuard } from "src/auth/auth.guard";
import { RolesGuard } from "src/auth/roles.guard";

@Controller("api/v1/events")
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  create(@Body() body, @Req() req) {
    return this.eventsService.createEvent(body, req.user.id);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.eventsService.getAllEvents();
  }

  @UseGuards(AuthGuard)
  @Post(":id/join")
  join(@Param("id") id: string, @Req() req) {
    return this.eventsService.joinEvent(id, req.user.id);
  }
}
