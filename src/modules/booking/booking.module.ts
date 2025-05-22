import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { PlanController } from './plan.controller';
import { CheckoutController } from './checkout.controller';
import { BookingService } from './services/booking.service';
import { PlanService } from './services/plan.service';
import { CheckoutService } from './services/checkout.service';

@Module({
  controllers: [BookingController, PlanController, CheckoutController],
  providers: [BookingService, PlanService, CheckoutService],
  exports: [BookingService, PlanService, CheckoutService],
})
export class BookingModule {}
