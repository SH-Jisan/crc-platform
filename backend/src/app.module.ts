import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { PrismaModule } from "./prisma/prisma.module";
import { EventsModule } from "./events/events.module";
import { CampaignsModule } from "./campaigns/campaigns.module";
import { DonationsModule } from "./donations/donations.module";
import { PostsModule } from "./posts/posts.module";
import { GalleryModule } from "./gallery/gallery.module";
import { SupabaseModule } from './supabase/supabase.module';
import { ConfigModule } from "@nestjs/config";
import { AdminModule } from './admin/admin.module';
import { SuccessStoriesModule } from './success-stories/success-stories.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { DataExportModule } from './data-export/data-export.module';
import { AnnouncementsModule } from './announcements/announcements.module';
import { SearchModule } from './search/search.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SupabaseModule,
    PrismaModule,
    UsersModule,
    EventsModule,
    CampaignsModule,
    DonationsModule,
    PostsModule,
    GalleryModule,
    AdminModule,
    SuccessStoriesModule,
    AuditLogsModule,
    DataExportModule,
    AnnouncementsModule,
    SearchModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
