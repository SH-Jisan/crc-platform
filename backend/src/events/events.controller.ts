import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';
import { GetUser } from '../common/decorators/get-user.decorator';

@Controller('events')
@UseGuards(AuthGuard, RolesGuard) // 🔥 Pura controller ta secure kora holo
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @Roles('ADMIN', 'MEMBER') // 🔥 Shudhu Admin ar Member ra event toiri korte parbe
  create(@Body() createEventDto: CreateEventDto, @GetUser('id') userId: string) { // 🔥 Notun GetUser decorator use korlam
    return this.eventsService.createEvent(createEventDto, userId);
  }

  @Public() // 🔥 Website visitor ra login charai shob event dekhte parbe
  @Get()
  getAllEvents(@Query() paginationQuery: PaginationQueryDto) {
    const { page, limit } = paginationQuery;
    return this.eventsService.getAllEvents(page, limit);
  }
}