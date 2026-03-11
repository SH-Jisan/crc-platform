import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
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
      },
    });
  }

  async getAllEvents(page: number = 1, limit: number = 10) {
    const skip =  (page-1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.event.findMany({
        skip,
        take: limit,
        include: { participants: true },
        orderBy: { event_date: 'desc' },
      }),
      this.prisma.event.count(),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    }
  }

  async getEventById(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: { participants: { include: { user: { select: { full_name: true, avatar_url: true } } } }, creator: { select: { full_name: true } } },
    });
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  async updateEvent(id: string, data: UpdateEventDto) {
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
    return this.prisma.eventParticipant.create({
      data: {
        event_id: eventId,
        user_id: userId,
        status: "JOINED",
      },
    });
  }
}