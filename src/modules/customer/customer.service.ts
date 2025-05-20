import { Account, AccountRole } from '@/database/entities/Account.entity';
import { Customer } from '@/database/entities/Customer.entity';
import { Transaction } from '@/database/entities/Transaction.entity';
import { EntityManager, MikroORM, Transactional } from '@mikro-orm/core';
import { Injectable, Logger } from '@nestjs/common';
import { PaymentService } from '../payment/payment.service';
import { TransactionAction, TransactionStatus } from '../transaction/enums';
import { ClerkWebhookPayload, ICustomerService } from './interfaces';
import { DepositTransactionReqDTO } from './dtos/transaction.dto';
@Injectable()
export class CustomerService implements ICustomerService {
  private readonly logger = new Logger(CustomerService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly paymentService: PaymentService,
    private readonly orm: MikroORM,
  ) {}

  @Transactional()
  async synCustomerFromClerkWebhook(data: ClerkWebhookPayload): Promise<void> {
    this.logger.log(`Syncing customer ${data.data.id}`);

    const account = await this.em.upsert(Account, {
      id: data.data.id,
      firstName: data.data.first_name,
      lastName: data.data.last_name,
      email: data.data.email_addresses[0].email_address,
      role: AccountRole.USER,
    });

    await this.em.upsert(Customer, {
      id: data.data.id,
      account,
    });

    this.logger.log(`Customer ${data.data.id} synced`);
  }

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
  }): Promise<any> {
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
}
