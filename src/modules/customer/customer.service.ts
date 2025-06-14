import { Customer } from '@/database/entities/Account.entity';
import { Booking } from '@/database/entities/Booking.entity';
import { Transaction } from '@/database/entities/Transaction.entity';
import { EntityManager, MikroORM, Transactional } from '@mikro-orm/core';
import { Injectable, Logger } from '@nestjs/common';
import * as dayjs from 'dayjs';
import * as isoWeek from 'dayjs/plugin/isoWeek';
import * as _ from 'lodash';
import { PaymentService } from '../payment/payment.service';
import { TransactionAction, TransactionStatus } from '../transaction/enums';
import {
  DepositTransactionReqDTO,
  DepositTransactionResDTO,
} from './dtos/transaction.dto';
import { CustomerStatisticsQueryDTO } from './dtos/statistics.dto';
import { ICustomerService } from './interfaces';

// Extend dayjs with plugins
dayjs.extend(isoWeek);

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

  /**
   * Get customer statistics by period (week or month)
   */
  async getCustomerStatistics(query: CustomerStatisticsQueryDTO) {
    const { period, startDate, endDate } = query;

    // Set default date range if not provided
    const end = endDate ? dayjs(endDate) : dayjs();
    const start = startDate
      ? dayjs(startDate)
      : end.subtract(period === 'week' ? 3 : 6, period);

    // Get all customers
    const allCustomers = await this.em.find(Customer, {});
    const totalCustomers = allCustomers.length;

    // Get all transactions in the date range
    const transactions = await this.em.find(Transaction, {
      createdAt: { $gte: start.toDate(), $lte: end.toDate() },
      status: TransactionStatus.SUCCESS,
    });

    // Get all bookings in the date range
    const bookings = await this.em.find(Booking, {
      createdAt: { $gte: start.toDate(), $lte: end.toDate() },
    });

    // Get customers created in the date range
    const newCustomers = await this.em.find(Customer, {
      createdAt: { $gte: start.toDate(), $lte: end.toDate() },
    });

    // Group data by period
    const groupedData: Record<
      string,
      {
        newCustomers: number;
        activeCustomers: Set<string>;
        totalBookings: number;
        totalDeposits: number;
      }
    > = {};

    // Initialize periods
    const periodFormat = period === 'week' ? 'YYYY-[W]WW' : 'YYYY-MM';
    let currentDate = start.clone();

    while (currentDate.isBefore(end) || currentDate.isSame(end, period)) {
      const periodKey = currentDate.format(periodFormat);
      groupedData[periodKey] = {
        newCustomers: 0,
        activeCustomers: new Set<string>(),
        totalBookings: 0,
        totalDeposits: 0,
      };
      currentDate = currentDate.add(1, period);
    }

    // Process new customers
    newCustomers.forEach((customer) => {
      const date = dayjs(customer.createdAt);
      const periodKey = date.format(periodFormat);

      if (groupedData[periodKey]) {
        groupedData[periodKey].newCustomers += 1;
      }
    });

    // Process transactions
    transactions.forEach((transaction) => {
      const date = dayjs(transaction.createdAt);
      const periodKey = date.format(periodFormat);

      if (groupedData[periodKey]) {
        // Add customer to active set
        groupedData[periodKey].activeCustomers.add(transaction.customer.id);

        // Count deposits
        if (transaction.action === TransactionAction.DEPOSIT) {
          groupedData[periodKey].totalDeposits += 1;
        }
      }
    });

    // Process bookings
    bookings.forEach((booking) => {
      const date = dayjs(booking.createdAt);
      const periodKey = date.format(periodFormat);

      if (groupedData[periodKey]) {
        groupedData[periodKey].totalBookings += 1;
        // Add customer to active set if not already added
        groupedData[periodKey].activeCustomers.add(booking.customer.id);
      }
    });

    // Convert to array and format
    const data = Object.entries(groupedData).map(([period, stats]) => ({
      period,
      newCustomers: stats.newCustomers,
      activeCustomers: stats.activeCustomers.size,
      totalBookings: stats.totalBookings,
      totalDeposits: stats.totalDeposits,
    }));

    // Sort by period
    data.sort((a, b) => a.period.localeCompare(b.period));

    // Calculate summary statistics
    const activeCustomersThisPeriod = new Set<string>();
    let newCustomersThisPeriod = 0;
    let totalBookingsThisPeriod = 0;
    let totalDepositsThisPeriod = 0;

    data.forEach((item) => {
      newCustomersThisPeriod += item.newCustomers;
      totalBookingsThisPeriod += item.totalBookings;
      totalDepositsThisPeriod += item.totalDeposits;
    });

    // Get unique active customers across all periods
    transactions.forEach((tx) => activeCustomersThisPeriod.add(tx.customer.id));
    bookings.forEach((booking) =>
      activeCustomersThisPeriod.add(booking.customer.id),
    );

    return {
      summary: {
        totalCustomers,
        activeCustomersThisPeriod: activeCustomersThisPeriod.size,
        newCustomersThisPeriod,
        totalBookingsThisPeriod,
        totalDepositsThisPeriod,
        period: {
          startDate: start.toDate(),
          endDate: end.toDate(),
        },
      },
      data,
    };
  }
}
