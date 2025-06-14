import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { PlanController } from './plan.controller';
import { CheckoutController } from './checkout.controller';
import { BookingStatisticsController } from './statistics.controller';
import { BookingService } from './services/booking.service';
import { PlanService } from './services/plan.service';
import { CheckoutService } from './services/checkout.service';
import { StatisticsService } from './services/statistics.service';

@Module({
  controllers: [
    BookingController,
    PlanController,
    CheckoutController,
    BookingStatisticsController,
  ],
  providers: [BookingService, PlanService, CheckoutService, StatisticsService],
  exports: [BookingService, PlanService, CheckoutService, StatisticsService],
})
export class BookingModule {}
