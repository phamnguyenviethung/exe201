import { EntityManager } from '@mikro-orm/core';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BuyPlanReqDTO } from '../dtos';
import { Customer } from '@/database/entities/Account.entity';
import { Booking, Plan } from '@/database/entities/Booking.entity';
import { Transactional } from '@mikro-orm/core';
import { TransactionAction } from '@/modules/transaction/enums';
import { TransactionStatus } from '@/modules/transaction/enums';
import { Transaction } from '@/database/entities/Transaction.entity';
@Injectable()
export class CheckoutService {
  constructor(private readonly em: EntityManager) {}

  @Transactional()
  async buyPlan(customer: Customer, dto: BuyPlanReqDTO) {
    const plan = await this.em.findOne(Plan, {
      id: dto.planId,
    });

    if (!plan) {
      throw new NotFoundException(`Plan with id ${dto.planId} not found`);
    }

    if (plan.price > customer.balance) {
      throw new BadRequestException('Insufficient balance');
    }

    customer.balance -= plan.price;

    const transaction = await this.em.create<Transaction>(Transaction, {
      amount: plan.price,
      customer,
      status: TransactionStatus.SUCCESS,
      action: TransactionAction.BOOKING,
      paymentData: {},
    });

    const booking = await this.em.create<Booking>(Booking, {
      customer,
      plan,
      transaction,
    });
    await this.em.flush();

    return booking.id;
  }
}
