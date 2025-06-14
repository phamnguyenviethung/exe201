import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { PaymentModule } from '../payment/payment.module';
import { StatisticsController } from './statistics.controller';

@Module({
  imports: [PaymentModule],
  controllers: [CustomerController, StatisticsController],
  providers: [CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}
