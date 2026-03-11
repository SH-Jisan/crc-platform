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
@UseGuards(AuthGuard, RolesGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @Roles('ADMIN', 'MEMBER')
  create(@Body() createEventDto: CreateEventDto, @GetUser('id') userId: string) {
    return this.eventsService.createEvent(createEventDto, userId);
  }

  @Public()
  @Get()
  getAllEvents(@Query() paginationQuery: PaginationQueryDto) {
    const { page, limit } = paginationQuery;
    return this.eventsService.getAllEvents(page, limit);
  }

  @Public()
  @Get(':id')
  getEventById(@Param('id') id: string) {
    return this.eventsService.getEventById(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'MEMBER')
  updateEvent(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.updateEvent(id, updateEventDto);
  }

  @Delete(':id')
  @Roles('ADMIN') // Shudhu Admin delete korte parbe
  deleteEvent(@Param('id') id: string) {
    return this.eventsService.deleteEvent(id);
  }

  @Post(':id/join')
  @Roles('MEMBER', 'ADMIN') // Properly restricted
  joinEvent(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.eventsService.joinEvent(id, userId);
  }
}