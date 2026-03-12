import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../common/decorators/public.decorator';
import { SupabaseService } from '../supabase/supabase.client';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
      private reflector: Reflector,
      private supabaseService: SupabaseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authentication token is missing or invalid');
    }

    const token = authHeader.split(' ')[1];

    try {
      // Verify token directly using Supabase API
      const { data, error } = await this.supabaseService.getClient().auth.getUser(token);

      if (error || !data?.user) {
        throw new UnauthorizedException('Invalid or expired token');
      }

      // Attach the verified user payload to the request
      request.user = data.user;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Authentication failed');
    }
  }
}
