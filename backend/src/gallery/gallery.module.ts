import { Module } from '@nestjs/common';
import { GalleryController } from './gallery.controller';
import { GalleryService } from './gallery.service';
import { PrismaModule } from '../prisma/prisma.module'; // 🔥 PrismaModule যুক্ত করা হলো

@Module({
  imports: [PrismaModule], // 🔥 ডাটাবেসের জন্য
  controllers: [GalleryController],
  providers: [GalleryService]
})
export class GalleryModule {}