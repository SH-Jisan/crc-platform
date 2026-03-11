import { Global, Module } from '@nestjs/common';
import { SupabaseService } from './supabase.client';

@Global() // Global korar fole onno module e bar bar import korte hobe na
@Module({
    providers: [SupabaseService],
    exports: [SupabaseService],
})
export class SupabaseModule {}