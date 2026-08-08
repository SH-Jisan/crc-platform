import { Injectable, NotFoundException, ConflictException, BadRequestException, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateEventDto } from "./dto/create-event.dto";
import { UpdateEventDto } from "./dto/update-event.dto";

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async createEvent(data: CreateEventDto, userId: string) {
    return this.prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        location: data.location,
        event_date: new Date(data.event_date),
        created_by: userId,
        status: "UPCOMING",
        meta_title: data.meta_title,
        meta_description: data.meta_description,
        is_donation_enabled: data.is_donation_enabled ?? false,
        goal_amount: data.is_donation_enabled ? Number(data.goal_amount) : 0,
      },
    });
  }

  async getAllEvents(page: number = 1, limit: number = 10) {
    const safeLimit = Math.min(Math.max(1, Number(limit) || 10), 100);
    const safePage = Math.max(1, Number(page) || 1);
    const skip = (safePage - 1) * safeLimit;

    const [data, total] = await Promise.all([
      this.prisma.event.findMany({
        skip,
        take: safeLimit,
        include: {
          _count: { select: { participants: true } },
          creator: { select: { full_name: true } },
        },
        orderBy: { event_date: 'desc' },
      }),
      this.prisma.event.count(),
    ]);

    return {
      data,
      meta: {
        total,
        page: safePage,
        limit: safeLimit,
        totalPages: Math.ceil(total / safeLimit),
      }
    };
  }

  async getEventById(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: { 
        _count: { select: { participants: true } }, 
        creator: { select: { full_name: true } } 
      },
    });
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  async updateEvent(id: string, data: UpdateEventDto, userId: string, roles: string[] = []) {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) throw new NotFoundException('Event not found');

    const isAdmin = roles.includes('ADMIN');
    if (!isAdmin && event.created_by !== userId) {
      throw new ForbiddenException('You can only update events you created');
    }

    return this.prisma.event.update({
      where: { id },
      data: {
        ...data,
        event_date: data.event_date ? new Date(data.event_date) : undefined,
      },
    });
  }

  async deleteEvent(id: string) {
    return this.prisma.event.delete({
      where: { id },
    });
  }

  async joinEvent(eventId: string, userId: string) {
    const event = await this.prisma.event.findUnique({ where: { id: eventId } });
    if (!event) throw new NotFoundException('Event not found');
    if (event.status !== 'UPCOMING') {
      throw new BadRequestException('Cannot join an event that is not UPCOMING');
    }

    const existingParticipant = await this.prisma.eventParticipant.findUnique({
      where: {
        user_id_event_id: {
          user_id: userId,
          event_id: eventId,
        },
      },
    });

    if (existingParticipant) {
      throw new ConflictException('You have already joined this event');
    }

    try {
      return await this.prisma.eventParticipant.create({
        data: {
          event_id: eventId,
          user_id: userId,
          status: "JOINED",
        },
      });
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new ConflictException('You have already joined this event');
      }
      throw error;
    }
  }
}