import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullBoardModule } from '@bull-board/nestjs';
import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { TransactionQueue } from './enums/queue';
import { PaymentGatewayFactory } from './gateways/gateway.factory';
import { ZalopayGateWay } from './gateways/zalopay.gateway';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { PayOSGateway } from './gateways/payos.gateway';

@Module({
  imports: [
    HttpModule,
    BullModule.registerQueue({
      name: TransactionQueue.name,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 3000,
        },
      },
    }),
    BullBoardModule.forFeature({
      name: TransactionQueue.name,
      adapter: BullMQAdapter,
    }),
  ],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    PaymentGatewayFactory,
    ZalopayGateWay,
    PayOSGateway,
  ],
  exports: [PaymentService],
})
export class PaymentModule {}
