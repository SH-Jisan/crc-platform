import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Header, NotFoundException } from '@nestjs/common';
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
  @Get(':id/share')
  @Header('Content-Type', 'text/html')
  async getShareableLink(@Param('id') id: string, @Query('redirect') redirectUrl: string) {
      try {
          const event = await this.eventsService.getEventById(id);
          const title = event.title || 'CRC Event';
          const description = event.description ? event.description.substring(0, 150) + '...' : 'Join our upcoming event at Come for Road Child!';
          const imageUrl = 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop';

          return `
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <title>${title}</title>
              <meta property="og:type" content="article">
              <meta property="og:title" content="${title}">
              <meta property="og:description" content="${description}">
              <meta property="og:image" content="${imageUrl}">
              <meta property="og:url" content="${redirectUrl || '#'}">
              <meta name="twitter:card" content="summary_large_image">
              <meta name="twitter:title" content="${title}">
              <meta name="twitter:description" content="${description}">
              <meta name="twitter:image" content="${imageUrl}">
              <meta http-equiv="refresh" content="0;url=${redirectUrl || '/events'}">
              <script>window.location.href = "${redirectUrl || '/events'}";</script>
          </head>
          <body><p>Redirecting to event...</p></body>
          </html>`;
      } catch {
          throw new NotFoundException('Event not found');
      }
  }

  @Public()
  @Get(':id')
  getEventById(@Param('id') id: string) {
    return this.eventsService.getEventById(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'MEMBER')
  updateEvent(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto, @GetUser() user: any) {
    const userId = user?.id || user?.sub;
    const roles = user?.roles || [];
    return this.eventsService.updateEvent(id, updateEventDto, userId, roles);
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