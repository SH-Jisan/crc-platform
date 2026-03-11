import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
    private supabase: SupabaseClient;

    constructor() {
        // Environment variables theke URL ar KEY nibe.
        // .env file e SUPABASE_URL ar SUPABASE_KEY na thakle add kore nite hobe.
        this.supabase = createClient(
            process.env.SUPABASE_URL || '',
            process.env.SUPABASE_KEY || ''
        );
    }

    getClient(): SupabaseClient {
        return this.supabase;
    }
}