import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';

import { RequestWithUser } from '@/share/types/request.type';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Webhook } from 'svix';
import { ClerkAuthGuard } from '../auth/guard/clerk.guard';
import { CustomerService } from './customer.service';
import { DepositTransactionReqDTO, DepositTransactionResDTO } from './dtos/';
import { ClerkWebhookPayload } from './interfaces';

@ApiTags('Customers')
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

  @Get('me')
  @UseGuards(ClerkAuthGuard)
  @ApiOperation({ summary: 'Get current customer profile' })
  async getMe(@Req() request: RequestWithUser) {
    return this.customerService.getMe(request.user.id);
  }

  @Post('deposit')
  @UseGuards(ClerkAuthGuard)
  @ApiOperation({ summary: 'Create a deposit transaction' })
  @ApiResponse({
    status: 201,
    description: 'Deposit transaction created successfully',
    type: DepositTransactionResDTO,
  })
  async deposit(
    @Body() dto: DepositTransactionReqDTO,
    @Req() request: RequestWithUser,
  ) {
    const host =
      this.configSerivce.get<string>(`NODE_ENV`) === 'production'
        ? `https://${request.get('host')}`
        : this.configSerivce.get<string>(`NGROK_URL`);

    return this.customerService.createDepositPaymentLink({
      ip: request.ip,
      host,
      dto,
      userID: request.user.id,
    });
  }

  @Get('list')
  @UseGuards(ClerkAuthGuard)
  @ApiOperation({ summary: 'Get all customers' })
  async getAllCustomers() {
    return this.customerService.getAllCustomers();
  }
}
