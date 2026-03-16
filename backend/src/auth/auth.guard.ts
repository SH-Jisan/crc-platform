import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { IS_PUBLIC_KEY } from '../common/decorators/public.decorator';
import * as jwt from 'jsonwebtoken';
import * as jwksRsa from 'jwks-rsa';

@Injectable()
export class AuthGuard implements CanActivate {
  private client: jwksRsa.JwksClient;

  constructor(
      private reflector: Reflector,
      private configService: ConfigService, // ConfigService অ্যাড করা হয়েছে
  ) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');

    // 🚀 Supabase এর Public Key মেমোরিতে ক্যাশ (Cache) করে রাখা হচ্ছে
    this.client = jwksRsa({
      jwksUri: `${supabaseUrl}/auth/v1/.well-known/jwks.json`,
      cache: true,
      rateLimit: true,
    });
  }

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
      // 🛡️ 100% Local ES256 Verification using Public Key
      const decoded = await new Promise<any>((resolve, reject) => {
        jwt.verify(
            token,
            (header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) => {
              if (!header.kid) {
                return callback(new Error('No kid in JWT header'));
              }

              // মেমোরি থেকে Public Key নেওয়া হচ্ছে
              this.client.getSigningKey(header.kid, (err: any, key: any) => {
                if (err) return callback(err);
                const signingKey = key?.getPublicKey();
                callback(null, signingKey);
              });
            },
            { algorithms: ['ES256', 'RS256'] }, // 🌟 তোমার টোকেনের আসল অ্যালগরিদম
            (err: any, decodedToken: any) => {
              if (err) reject(err);
              else resolve(decodedToken);
            }
        );
      });

      // Request-এর ভেতরে ইউজারের আইডি ও ইমেইল সেট করে দেওয়া হলো
      request.user = {
        id: decoded.sub,
        email: decoded.email,
        roles: decoded.app_metadata?.roles || []
      };

      return true;

    } catch (err: any) {
      console.error("\n=== 🚨 JWT Verification Error ===");
      console.error(err.message);

      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token has expired');
      }
      throw new UnauthorizedException('Invalid authentication token');
    }
  }
}