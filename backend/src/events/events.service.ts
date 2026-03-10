/* eslint-disabled */
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async createEvent(data: any, userId: string) {
    return this.prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        location: data.location,
        event_date: new Date(data.event_date),
        created_by: userId,
        status: data.status || "UPCOMING",
        meta_title: data.meta_title,         // 🔥 SEO Field
        meta_description: data.meta_description, // 🔥 SEO Field
      },
    });
  }

  async getAllEvents() {
    return this.prisma.event.findMany({
      include: {
        participants: true,
      },
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