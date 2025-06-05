import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { ClerkClientProvider } from '@/share/providers/clerk.provider';
import { ClerkStrategy } from './strategy/clerk.strategy';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [AuthController],
  imports: [PassportModule, ConfigModule, JwtModule.register({}), HttpModule],
  providers: [ClerkStrategy, ClerkClientProvider, AuthService],
})
export class AuthModule {}
