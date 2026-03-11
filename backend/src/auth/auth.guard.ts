import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from '../supabase/supabase.client';
import { IS_PUBLIC_KEY } from '../common/decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  private supabase: SupabaseClient;

  constructor(
      private reflector: Reflector,
      private supabaseService: SupabaseService,
  ) {
    this.supabase = this.supabaseService.getClient();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if the route is marked as @Public()
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Authentication token is missing');
    }

    // Verify token with Supabase
    const { data: { user }, error } = await this.supabase.auth.getUser(token);

    if (error || !user) {
      throw new UnauthorizedException('Invalid or expired authentication token');
    }

    // Attach user to request object
    request.user = user;
    return true;
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}