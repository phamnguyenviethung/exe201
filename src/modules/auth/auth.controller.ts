import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ClerkWebhookPayload } from '../customer/interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('accounts/sync')
  async syncCustomerFromClerkWebhook(@Body() data: ClerkWebhookPayload) {
    return this.authService.synCustomerFromClerkWebhook(data);
  }
}
