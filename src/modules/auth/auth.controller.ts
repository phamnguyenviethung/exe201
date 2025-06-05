import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ClerkWebhookPayload } from '../customer/interfaces';
import { RequestWithUser } from '@/share/types/request.type';
import { ClerkAuthGuard } from './guard/clerk.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('accounts/sync')
  async syncCustomerFromClerkWebhook(@Body() data: ClerkWebhookPayload) {
    return this.authService.synCustomerFromClerkWebhook(data);
  }

  @Get('accounts/me')
  @UseGuards(ClerkAuthGuard)
  async getMyProfile(@Req() req: RequestWithUser) {
    return this.authService.getProfile(req.user.id);
  }

  @Post('accounts/create-test-token')
  async createTestToken(@Query('email') email: string) {
    return this.authService.createTestToken(email);
  }
}
