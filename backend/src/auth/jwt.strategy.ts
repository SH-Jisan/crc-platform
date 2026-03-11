import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    const secret = configService.get<string>('SUPABASE_JWT_SECRET');
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret || 'super-secret-default-which-should-be-changed-in-env',
    });
  }

  // ESLint error bypass due to any, but defining proper payload struct ideally
  // eslint-disable-next-line @typescript-eslint/require-await
  async validate(payload: any) {
    if (!payload?.sub) {
      throw new UnauthorizedException();
    }
    // Supabase JWT stores User ID in "sub"
    return { id: payload.sub, email: payload.email, roles: payload.app_metadata?.roles || [] };
  }
}
