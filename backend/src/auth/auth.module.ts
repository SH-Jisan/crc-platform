import { Module } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { AuthGuard } from './auth.guard';
import { RolesGuard } from './roles.guard';
import { PrismaModule } from '../prisma/prisma.module';
import { SupabaseModule } from '../supabase/supabase.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' }), PrismaModule, SupabaseModule, CacheModule.register()],
  providers: [JwtStrategy, AuthGuard, RolesGuard],
  exports: [PassportModule, JwtStrategy, AuthGuard, RolesGuard, CacheModule],
})
export class AuthModule {}
