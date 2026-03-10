import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { PrismaModule } from "./prisma/prisma.module";
import { EventsModule } from "./events/events.module";
import { CampaignsModule } from "./campaigns/campaigns.module";
import { DonationsModule } from "./donations/donations.module";
import { GalleryController } from "./gallery/gallery.controller";
import { GalleryService } from "./gallery/gallery.service";
import { PostsModule } from "./posts/posts.module";
import { GalleryModule } from "./gallery/gallery.module";
import { ConfigModule } from "@nestjs/config";
import { AdminModule } from './admin/admin.module';
import { SuccessStoriesModule } from './success-stories/success-stories.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { DataExportModule } from './data-export/data-export.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
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
  ],
  controllers: [AppController, GalleryController],
  providers: [AppService, GalleryService],
})
export class AppModule {}
