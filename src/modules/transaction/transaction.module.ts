import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { ProcessTransactionWorker } from './workers/processTransaction.worker';
import { CustomerModule } from '../customer/customer.module';

@Module({
  imports: [CustomerModule],
  controllers: [TransactionController],
  providers: [TransactionService, ProcessTransactionWorker],
})
export class TransactionModule {}
