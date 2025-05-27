import { Customer } from '@/database/entities/Account.entity';
import { Transaction } from '@/database/entities/Transaction.entity';
import { EntityManager, MikroORM, Transactional } from '@mikro-orm/core';
import { Injectable, Logger } from '@nestjs/common';
import * as dayjs from 'dayjs';
import * as _ from 'lodash';
import { PaymentService } from '../payment/payment.service';
import { TransactionAction, TransactionStatus } from '../transaction/enums';
import {
  DepositTransactionReqDTO,
  DepositTransactionResDTO,
} from './dtos/transaction.dto';
import { ICustomerService } from './interfaces';

@Injectable()
export class CustomerService implements ICustomerService {
  private readonly logger = new Logger(CustomerService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly paymentService: PaymentService,
    private readonly orm: MikroORM,
  ) {}

  private generateOrderCode(): string {
    const prefix = dayjs().format('YYMMDD');
    const random = _.random(100000, 999999);
    return `${prefix}${random}`;
  }

  @Transactional()
  async createDepositPaymentLink(params: {
    ip: string;
    host: string;
    dto: DepositTransactionReqDTO;
    userID: string;
  }): Promise<DepositTransactionResDTO> {
    const em = this.orm.em.fork();
    const orderCode = this.generateOrderCode();

    const customer = await em.findOneOrFail(Customer, {
      id: params.userID,
    });

    const transaction = await em.create(Transaction, {
      id: orderCode,
      amount: params.dto.amount,
      customer,
      status: TransactionStatus.PENDING,
      action: TransactionAction.DEPOSIT,
      paymentData: {},
    });

    await em.flush();

    this.logger.log(
      `Transaction ${transaction.id} created for customer ${customer.id}`,
    );

    const result = await this.paymentService.createPaymentLink(
      params.dto.gateway,
      {
        ip: params.ip,
        host: params.host,
        returnUrl: params.dto.returnUrl,
        orderCode,
        amount: params.dto.amount,
      },
    );
    const paymentUrl = result.url;

    return { paymentUrl, transactionID: orderCode };
  }

  @Transactional()
  async processDepositTransaction(transactionID: string): Promise<void> {
    const em = this.orm.em.fork();

    const transaction = await em.findOneOrFail(Transaction, {
      id: transactionID,
    });

    if (transaction.status !== TransactionStatus.PENDING) {
      throw new Error('Transaction is not pending');
    }
    transaction.status = TransactionStatus.SUCCESS;

    const customer = await em.findOneOrFail(Customer, {
      id: transaction.customer.id,
    });

    customer.balance += transaction.amount;
    await em.flush();
    this.logger.log(
      `Customer ${customer.id} balance updated to ${customer.balance}`,
    );
  }

  async getAllCustomers(): Promise<Customer[]> {
    return this.em.find(Customer, {}, { populate: ['account'] });
  }
}
