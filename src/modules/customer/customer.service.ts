import { Customer } from '@/database/entities/Account.entity';
import { Transaction } from '@/database/entities/Transaction.entity';
import { EntityManager, MikroORM, Transactional } from '@mikro-orm/core';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PaymentService } from '../payment/payment.service';
import { TransactionAction, TransactionStatus } from '../transaction/enums';
import { CustomerProfileDtoType } from './dtos/customer.dto';
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
    const prefix = 'NT';
    const random = Math.random().toString(36).substring(2, 15);
    return `${prefix}-${random}`;
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

  async getMe(customerId: string): Promise<CustomerProfileDtoType> {
    const customer = await this.em.findOne(
      Customer,
      { id: customerId },
      { populate: ['account'] },
    );

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${customerId} not found`);
    }

    return customer;
  }

  async getAllCustomers(): Promise<Customer[]> {
    return this.em.find(Customer, {}, { populate: ['account'] });
  }
}
