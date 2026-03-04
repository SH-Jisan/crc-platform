import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [PrismaModule, UsersModule, EventsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
