import {
  Injectable,
  Inject,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { Request } from 'express';
import { ClerkClient } from '@clerk/backend';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ClerkStrategy extends PassportStrategy(Strategy, 'clerk') {
  private readonly logger = new Logger(ClerkStrategy.name);

  constructor(
    @Inject('ClerkClient')
    private readonly clerkClient: ClerkClient,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    super();
  }

  async validate(req: Request): Promise<any> {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        throw new UnauthorizedException('No token provided');
      }
      const publicKey = this.configService.get('CLERK_JWT_KEY');

      const verifiedToken = await this.jwtService.verifyAsync(token, {
        publicKey,
      });

      if (!verifiedToken) {
        throw new UnauthorizedException('Invalid token');
      }
      const data = await this.clerkClient.users.getUser(verifiedToken.sub);

      return data;
    } catch (error) {
      this.logger.error('Authentication failed', error);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Authentication failed');
    }
  }
}
