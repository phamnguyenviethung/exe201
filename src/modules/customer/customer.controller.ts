import { Controller, Post, Req } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { Webhook } from 'svix';
import { CustomerService } from './customer.service';
import { ClerkWebhookPayload } from './interfaces';
@Controller('customers')
export class CustomerController {
  constructor(
    private readonly customerService: CustomerService,
    private configSerivce: ConfigService,
  ) {}

  @Post('sync')
  async synCustomerFromClerkWebhook(@Req() req) {
    const wh = new Webhook(
      this.configSerivce.get('CLERK_WEBHOOK_SIGNING_SECRET'),
    );

    const data = await wh.verify(JSON.stringify(req.body), req.headers);

    await this.customerService.synCustomerFromClerkWebhook(
      data as ClerkWebhookPayload,
    );
  }
}
