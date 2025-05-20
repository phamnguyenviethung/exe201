import { Controller, Injectable, Post, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { Request } from 'express';
import { GatewayName } from './enums/gatewayName';
import { PaymentService } from './payment.service';

@Injectable()
@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly configService: ConfigService,
  ) {}

  @ApiExcludeEndpoint(true)
  @Post('zalopay/callback')
  async zalopayCallback(@Req() req: Request) {
    return await this.paymentService.handleCallback(GatewayName.ZALOPAY, {
      data: req.body,
      host: `${req.protocol}://${req.get('host')}`,
    });
  }

  @ApiExcludeEndpoint(true)
  @Post('payos/callback')
  async payosCallBack(@Req() req: Request) {
    return await this.paymentService.handleCallback(GatewayName.PAYOS, {
      data: req.body,
      host: `${req.protocol}://${req.get('host')}`,
    });
  }
}
