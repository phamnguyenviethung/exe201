import { RequestWithUser } from '@/share/types/request.type';
import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ClerkAuthGuard } from '../auth/guard/clerk.guard';
import { BuyPlanReqDTO } from './dtos/checkout.dto';
import { CheckoutService } from './services/checkout.service';

@ApiTags('Checkout')
@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post('buy-plan')
  @ApiOperation({ summary: 'Buy a plan' })
  @ApiResponse({
    status: 201,
    description: 'The plan has been successfully bought.',
  })
  @UseGuards(ClerkAuthGuard)
  async buyPlan(
    @Request() req: RequestWithUser,
    @Body() buyPlanDto: BuyPlanReqDTO,
  ) {
    return this.checkoutService.buyPlan(req.user, buyPlanDto);
  }
}
