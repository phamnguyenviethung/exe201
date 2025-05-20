import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { PaymentModule } from '../payment/payment.module';

@Module({
  controllers: [CustomerController],
  providers: [CustomerService],
  imports: [PaymentModule],
  exports: [CustomerService],
})
export class CustomerModule {}
